import difflib
import re
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, List, Optional

from bson import ObjectId

from app.constant.constants import DbCollections
from app.database import get_database


@dataclass
class ContextResult:
    """Result of a targeted MongoDB lookup for the AI assistant.

    status: ok | not_found | ambiguous | empty | error
    context: JSON-serializable snippet to hand to the LLM (only relevant data)
    display_name: the name that was searched for (doctor/hospital)
    suggestions: candidate names when ambiguous
    message: ready-to-use message when status != ok (no LLM call needed)
    """
    status: str = "ok"
    context: Optional[dict] = None
    display_name: Optional[str] = None
    suggestions: List[str] = field(default_factory=list)
    message: Optional[str] = None


def _clean_name(value: Optional[str]) -> str:
    if not value:
        return ""
    text = re.sub(r"(?i)^\s*(dr\.?)\s+", "", str(value))
    return text.strip().lower()


def _public_doctor(doctor: dict) -> dict:
    return {
        "fullname": doctor.get("fullname", ""),
        "experties": doctor.get("experties", ""),
        "degree": doctor.get("degree", ""),
        "about": doctor.get("about", ""),
        "is_active": doctor.get("is_active", True),
    }


def _public_hospital(hospital: dict) -> dict:
    return {
        "title": hospital.get("title", ""),
        "description": hospital.get("description", ""),
        "address": hospital.get("address", ""),
        "about": hospital.get("about", ""),
        "is_active": hospital.get("is_active", True),
    }


def _fuzzy_docs(key: str, docs: List[dict], field_name: str, threshold: float = 0.8) -> List[dict]:
    """Typo-tolerant fallback: rank docs by name similarity above a threshold."""
    scored = []
    for doc in docs:
        stored = _clean_name(doc.get(field_name, ""))
        if not stored:
            continue
        ratio = difflib.SequenceMatcher(None, key, stored).ratio()
        if ratio >= threshold:
            scored.append((ratio, doc))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [doc for _, doc in scored]


async def _all_doctors() -> List[dict]:
    return [doc async for doc in get_database()[DbCollections.DOCTOR_REGISTER_COLLECTION].find()]


async def _all_hospitals() -> List[dict]:
    return [doc async for doc in get_database()[DbCollections.HOSPITAL_COLLECTION].find()]


async def _find_doctors(doctor_name: str) -> List[dict]:
    """Case-insensitive, 'Dr' prefix-agnostic, typo-tolerant doctor lookup."""
    key = _clean_name(doctor_name)
    if not key:
        return []
    doctors = await _all_doctors()
    matches: List[dict] = []
    for doctor in doctors:
        stored = _clean_name(doctor.get("fullname", ""))
        if not stored:
            continue
        if key in stored or stored in key:
            matches.append(doctor)
    if matches:
        return matches
    return _fuzzy_docs(key, doctors, "fullname")


async def _find_hospitals(hospital_name: str) -> List[dict]:
    """Case-insensitive, typo-tolerant hospital lookup by title."""
    key = _clean_name(hospital_name)
    if not key:
        return []
    hospitals = await _all_hospitals()
    matches: List[dict] = []
    for hospital in hospitals:
        title = _clean_name(hospital.get("title", ""))
        if title and (key in title or title in key):
            matches.append(hospital)
    if matches:
        return matches
    return _fuzzy_docs(key, hospitals, "title")


async def find_entity_by_text(text: str, threshold: float = 0.78) -> Optional[dict]:
    """Resolve a free-text fragment (e.g. a bare name) to a hospital or doctor.

    Used when a message carries no intent keyword at all, so names like
    "Jacsto" or "jacksto" still hit the database instead of a generic reply.
    Returns {"kind": "hospital"|"doctor", "entity": doc, "matches": [...]} or None.
    """
    key = _clean_name(text)
    if not key:
        return None

    def score(docs: List[dict], field_name: str):
        ranked = []
        for doc in docs:
            stored = _clean_name(doc.get(field_name, ""))
            if not stored:
                continue
            if key == stored:
                ratio = 1.0
            elif key in stored or stored in key:
                ratio = 0.95
            else:
                ratio = difflib.SequenceMatcher(None, key, stored).ratio()
            ranked.append((ratio, doc))
        ranked.sort(key=lambda item: item[0], reverse=True)
        return ranked

    hospitals = score(await _all_hospitals(), "title")
    doctors = score(await _all_doctors(), "fullname")
    best_hospital = hospitals[0] if hospitals and hospitals[0][0] >= threshold else None
    best_doctor = doctors[0] if doctors and doctors[0][0] >= threshold else None
    if not best_hospital and not best_doctor:
        return None

    if best_hospital and (not best_doctor or best_hospital[0] >= best_doctor[0]):
        return {
            "kind": "hospital",
            "entity": best_hospital[1],
            "matches": [d.get("title", "") for s, d in hospitals if s >= threshold],
        }
    return {
        "kind": "doctor",
        "entity": best_doctor[1],
        "matches": [d.get("fullname", "") for s, d in doctors if s >= threshold],
    }


def _resolve_one(matches: List[dict], display_name: str, kind: str) -> ContextResult:
    """Pick a single best match; fail cleanly on none / multiple."""
    if not matches:
        if kind == "doctor":
            result = ContextResult(
                status="not_found", display_name=display_name,
                message=f'I couldn\'t find a doctor named "{display_name}" in the hospital database.',
            )
        else:
            result = ContextResult(
                status="not_found", display_name=display_name,
                message=f'I couldn\'t find a hospital named "{display_name}" in the hospital database.',
            )
        return result

    key = _clean_name(display_name)
    exact = [m for m in matches if _clean_name(
        m.get("fullname") if kind == "doctor" else m.get("title")).lower() == key]
    if len(exact) == 1:
        return ContextResult(status="ok", context={"entity": exact[0]}, display_name=display_name)

    if len(matches) == 1:
        return ContextResult(status="ok", context={"entity": matches[0]}, display_name=display_name)

    labels = sorted({
        (m.get("fullname") or m.get("title") or "?")
        for m in matches if (m.get("fullname") or m.get("title"))
    })
    result = ContextResult(
        status="ambiguous", display_name=display_name, suggestions=labels,
        message=(
            f"I found multiple {'doctors' if kind == 'doctor' else 'hospitals'} "
            f'matching "{display_name}": {", ".join(labels[:5])}. '
            "Could you provide more details so I can narrow it down?"
        ),
    )
    return result


async def _hospital_by_id(hospital_id: str) -> Optional[dict]:
    if not hospital_id:
        return None
    try:
        oid = ObjectId(hospital_id)
    except Exception:
        return None
    return await get_database()[DbCollections.HOSPITAL_COLLECTION].find_one({"_id": oid})


# --------------------------------------------------------------------------- #
# Intent-specific fetchers (targeted, minimal data only)
# --------------------------------------------------------------------------- #
async def get_hospitals_for_doctor(doctor_name: str) -> ContextResult:
    doctors = await _find_doctors(doctor_name)
    if not doctors:
        return ContextResult(
            status="not_found", display_name=doctor_name,
            message=f'I couldn\'t find a doctor named "{doctor_name}" in the hospital database.',
        )

    hospitals, seen = [], set()
    for doctor in doctors:
        hospital = await _hospital_by_id(doctor.get("hospital_id") or "")
        if not hospital:
            continue
        hid = str(hospital.get("_id"))
        if hid in seen:
            continue
        seen.add(hid)
        hospitals.append(_public_hospital(hospital))

    return ContextResult(
        status="ok",
        context={
            "doctor": {"fullname": doctors[0].get("fullname", ""),
                       "experties": doctors[0].get("experties", ""),
                       "degree": doctors[0].get("degree", "")},
            "hospitals": hospitals,
        },
        display_name=doctor_name,
    )


async def get_doctors_for_hospital(hospital_name: str) -> ContextResult:
    resolved = _resolve_one(await _find_hospitals(hospital_name), hospital_name, "hospital")
    if resolved.status != "ok":
        return resolved

    hospital = resolved.context["entity"]
    collection = get_database()[DbCollections.DOCTOR_REGISTER_COLLECTION]
    doctors = []
    async for doctor in collection.find({"hospital_id": str(hospital["_id"])}):
        doctors.append(_public_doctor(doctor))

    if not doctors:
        return ContextResult(
            status="empty", display_name=hospital.get("title", hospital_name),
            message=f"No doctors are currently listed for {hospital.get('title', hospital_name)} in the database.",
        )

    return ContextResult(
        status="ok",
        context={"hospital": _public_hospital(hospital), "doctors": doctors},
        display_name=hospital.get("title", hospital_name),
    )


async def get_doctor_schedule(doctor_name: str, hospital_name: Optional[str] = None) -> ContextResult:
    resolved = _resolve_one(await _find_doctors(doctor_name), doctor_name, "doctor")
    if resolved.status != "ok":
        return resolved

    doctor = resolved.context["entity"]

    if hospital_name:
        hosp_resolved = _resolve_one(await _find_hospitals(hospital_name), hospital_name, "hospital")
        if hosp_resolved.status != "ok":
            return hosp_resolved
        hospital = hosp_resolved.context["entity"]
        if str(doctor.get("hospital_id") or "") != str(hospital["_id"]):
            return ContextResult(
                status="not_found", display_name=doctor_name,
                message=(
                    f'Dr {doctor.get("fullname", doctor_name)} does not appear to practise at '
                    f'{hospital.get("title", hospital_name)} according to the database.'
                ),
            )

    doctor_id = str(doctor["_id"])
    collection = get_database()[DbCollections.SCHEDULE_COLLECTION]
    schedules = []
    async for sched in collection.find({"docId": doctor_id, "is_active": True}):
        schedules.append({
            "schedule_date": sched.get("schedule_date", ""),
            "schedule_time": sched.get("schedule_time", ""),
        })
    schedules.sort(key=lambda s: str(s.get("schedule_date", "")))

    context = {
        "doctor": {"fullname": doctor.get("fullname", ""), "experties": doctor.get("experties", "")},
        "schedules": schedules,
    }
    if not schedules:
        return ContextResult(
            status="empty", display_name=doctor.get("fullname", doctor_name),
            message=f'Dr {doctor.get("fullname", doctor_name)} currently has no published schedules in the database.',
        )

    return ContextResult(status="ok", context=context, display_name=doctor.get("fullname", doctor_name))


async def get_hospital_information(hospital_name: str) -> ContextResult:
    resolved = _resolve_one(await _find_hospitals(hospital_name), hospital_name, "hospital")
    if resolved.status != "ok":
        return resolved
    hospital = resolved.context["entity"]
    return ContextResult(
        status="ok",
        context={"hospital": _public_hospital(hospital)},
        display_name=hospital.get("title", hospital_name),
    )


async def get_hospital_reviews(hospital_name: str) -> ContextResult:
    resolved = _resolve_one(await _find_hospitals(hospital_name), hospital_name, "hospital")
    if resolved.status != "ok":
        return resolved
    hospital = resolved.context["entity"]

    collection = get_database()[DbCollections.REVIEW_COLLECTION]
    reviews = []
    total, count = 0, 0
    async for review in collection.find({"hospital_id": str(hospital["_id"])}):
        rating = review.get("rating") or 0
        total += rating
        count += 1
        reviews.append({"rating": rating, "review": review.get("review", "")})
    reviews.sort(key=lambda r: r["rating"], reverse=True)

    if not reviews:
        return ContextResult(
            status="empty", display_name=hospital.get("title", hospital_name),
            message=f'{hospital.get("title", hospital_name)} does not have any reviews in the database yet.',
        )

    return ContextResult(
        status="ok",
        context={
            "hospital": {"title": hospital.get("title", "")},
            "average_rating": round(total / count, 1) if count else 0,
            "review_count": count,
            "reviews": reviews[:15],
        },
        display_name=hospital.get("title", hospital_name),
    )


async def get_doctor_information(doctor_name: str) -> ContextResult:
    resolved = _resolve_one(await _find_doctors(doctor_name), doctor_name, "doctor")
    if resolved.status != "ok":
        return resolved
    doctor = resolved.context["entity"]

    hospital_title = ""
    hospital = await _hospital_by_id(doctor.get("hospital_id") or "")
    if hospital:
        hospital_title = hospital.get("title", "")

    return ContextResult(
        status="ok",
        context={
            "doctor": _public_doctor(doctor),
            "hospital_title": hospital_title,
        },
        display_name=doctor.get("fullname", doctor_name),
    )


async def get_patient_appointments(user_id: Optional[str]) -> ContextResult:
    if not user_id:
        return ContextResult(
            status="error", display_name=None,
            message="Please sign in to view your appointment details.",
        )

    collection = get_database()[DbCollections.APPOINTMENT_COLLECTION]
    rows = []
    async for appointment in collection.find({"user_id": user_id, "is_active": True}):
        rows.append({
            "schedule_date": appointment.get("schedule_date", ""),
            "schedule_time": appointment.get("schedule_time", ""),
            "is_approved": appointment.get("is_approved", False),
            "is_success": appointment.get("is_success", False),
            "payment_status": appointment.get("payment_status", "Pending"),
            "docId": appointment.get("docId", ""),
        })

    if not rows:
        return ContextResult(
            status="empty", display_name=None,
            message="You don't have any appointments in the system at the moment.",
        )

    doctor_ids = {r["docId"] for r in rows if r.get("docId")}
    names = {}
    if doctor_ids:
        valid_ids = [ObjectId(i) for i in doctor_ids if ObjectId.is_valid(i)]
        doctor_collection = get_database()[DbCollections.DOCTOR_REGISTER_COLLECTION]
        async for doctor in doctor_collection.find({"_id": {"$in": valid_ids}}):
            names[str(doctor["_id"])] = (doctor.get("fullname", ""), doctor.get("experties", ""))

    appointments = []
    for row in rows:
        name, specialty = names.get(row["docId"], ("", ""))
        appointments.append({
            "schedule_date": row["schedule_date"],
            "schedule_time": row["schedule_time"],
            "is_approved": row["is_approved"],
            "is_success": row["is_success"],
            "payment_status": row["payment_status"],
            "doctor_name": name,
            "doctor_specialty": specialty,
        })

    appointments.sort(key=lambda a: str(a.get("schedule_date", "")))
    present = [a for a in appointments if str(a.get("schedule_date", "")) >= datetime.utcnow().date().isoformat()]
    return ContextResult(
        status="ok",
        context={"appointments": appointments, "upcoming_first": True,
                 "as_on_date": datetime.utcnow().date().isoformat()},
        display_name=None,
    )
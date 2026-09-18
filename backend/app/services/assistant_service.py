import asyncio
import json
import os
import re
import threading
import time
from collections import OrderedDict, deque
from datetime import date
from typing import List, Optional

from app.services import ai_service, chat_history_service, knowledge_service
from app.services.ai_service import AIProviderError

SYSTEM_PROMPT = (
    "You are the AI Health Assistant for a Hospital Management System.\n"
    "You can answer general health questions, but when application database context is "
    "provided, you MUST use that context as the source of truth for hospital-specific "
    "information.\n"
    "Never invent: hospitals, doctors, schedules, appointments, reviews, ratings, patient "
    "information, or hospital services.\n"
    "If database context is provided, answer hospital/application-specific facts ONLY from "
    "the supplied context. If the requested application information is not present in the "
    "provided context, say that the information is not available rather than making it up.\n"
    "When a question mixes application data and general medical knowledge (for example "
    "'which doctors are at ABC Hospital and what does a cardiologist treat?'), answer the "
    "application part from the database context and the general part from medical knowledge, "
    "clearly distinguishing the two.\n"
    "For general health questions, provide a helpful informational response and do not "
    "present yourself as a replacement for a qualified medical professional; encourage "
    "consulting a real doctor for diagnosis.\n"
    "Never expose internal database IDs, authentication tokens, API keys, passwords, or "
    "other sensitive implementation details unless explicitly required and safe."
)

DATA_INTENTS = {
    "doctor_hospitals",
    "hospital_doctors",
    "doctor_schedule",
    "hospital_information",
    "patient_appointments",
    "appointment_information",
    "hospital_reviews",
    "doctor_information",
}

DATA_TRIGGERS = {
    "doctor", "doctors", "dr.", "dr ", "hospital", "hospitals", "clinic",
    "available", "availability", "appointment", "appointments", "booked", "booking",
    "schedule", "schedules", "slot", "slots", "timing", "timings",
    "review", "reviews", "rating", "ratings", "feedback",
    "work", "works", "working", "where", "which", "who", "when",
    "find", "status", "upcoming", "see patients", "consultation", "consulting",
    "specialization", "specialty", "about", "services", "tell me about", "located",
}

ENTITY_REQUIRED = {
    "doctor_hospitals": "doctor_name",
    "hospital_doctors": "hospital_name",
    "doctor_schedule": "doctor_name",
    "hospital_information": "hospital_name",
    "hospital_reviews": "hospital_name",
    "doctor_information": "doctor_name",
}
NO_ENTITY_INTENTS = {"patient_appointments", "appointment_information"}


# --------------------------------------------------------------------------- #
# Bounded in-memory conversation memory (per user, stateless across restarts)
# --------------------------------------------------------------------------- #
_MEMORY = OrderedDict()
_MEMORY_MAX_USERS = 200
_MEMORY_MAX_TURNS = 6
_MEMORY_TTL_SECONDS = 30 * 60
_MEMORY_LOCK = threading.Lock()


def _memory_key(user_id: Optional[str]) -> str:
    return user_id or "anonymous"


def _get_history(user_id: Optional[str]) -> List[dict]:
    key = _memory_key(user_id)
    with _MEMORY_LOCK:
        entry = _MEMORY.get(key)
        if not entry:
            return []
        timestamp, turns = entry
        if time.time() - timestamp > _MEMORY_TTL_SECONDS:
            _MEMORY.pop(key, None)
            return []
        return [{"role": role, "content": content} for role, content in turns][-4:]


def _push_turn(user_id: Optional[str], user_text: str, answer: str):
    key = _memory_key(user_id)
    with _MEMORY_LOCK:
        entry = _MEMORY.get(key)
        if not entry:
            if len(_MEMORY) >= _MEMORY_MAX_USERS:
                _MEMORY.popitem(last=False)
            entry = [time.time(), deque(maxlen=_MEMORY_MAX_TURNS)]
            _MEMORY[key] = entry
        entry[0] = time.time()
        entry[1].append(("user", user_text))
        entry[1].append(("assistant", answer or ""))


def _conversation_from_client(conversation) -> List[dict]:
    if not isinstance(conversation, list):
        return []
    clean = []
    for item in conversation:
        if not isinstance(item, dict):
            continue
        role = str(item.get("role") or "").lower()
        content = str(item.get("content") or "")
        if role not in ("user", "assistant"):
            continue
        clean.append({"role": role, "content": content})
    return clean[-4:]


# --------------------------------------------------------------------------- #
# Heuristic gates & fallback intent detection
# --------------------------------------------------------------------------- #
def has_data_trigger(question: str) -> bool:
    lowered = question.lower()
    return any(token in lowered for token in DATA_TRIGGERS)


_DOCTOR_STOPWORDS = {
    "available", "is", "are", "at", "in", "on", "works", "work", "see", "sees",
    "hospital", "hospitals", "with", "for", "when", "what", "where", "which",
    "appointment", "appointments", "schedule", "and", "the", "his", "her",
    "specialise", "specialize", "specialises", "specializes", "speciality",
    "specialist", "known", "best", "famous", "treat", "treats", "treating",
    "good", "do", "does", "did", "their", "my", "tell", "me", "about", "who",
    "can", "i", "find", "available", "meet", "visit", "has", "have",
}
_HOSPITAL_STOPWORDS = {
    "which", "what", "who", "are", "is", "the", "in", "at", "for", "about",
    "from", "list", "of", "and", "tell", "me", "a", "an", "show", "give", "get",
}
_HOSPITAL_BOUNDARIES = _HOSPITAL_STOPWORDS | {
    "where", "when", "how", "why", "do", "does", "did", "has", "have", "was",
    "were", "located", "provide", "provides", "services", "reviews", "review",
    "rating", "ratings", "feedback", "good", "best", "with", "near", "doctors",
    "doctor", "appointment", "appointments", "my", "i", "speciality", "specialities",
    "address", "contact", "phone", "emergency", "open",
}


def _extract_doctor_name(question: str) -> Optional[str]:
    match = re.search(r"\b(?:dr\.?\s+)([A-Za-z][A-Za-z .'_\-]{1,40})", question, re.IGNORECASE)
    if not match:
        return None
    tokens = []
    for token in match.group(1).split():
        if token.lower() in _DOCTOR_STOPWORDS:
            break
        tokens.append(token)
        if len(tokens) >= 3:
            break
    return " ".join(tokens).strip() or None


def _extract_hospital_name(question: str) -> Optional[str]:
    lowered = question.lower()
    idx = lowered.find("hospital")
    if idx != -1:
        tokens = []
        for word in reversed(question[:idx].split()):
            clean = word.strip(".,:;\"'()?!")
            if not clean:
                continue
            if clean.lower() in _HOSPITAL_BOUNDARIES:
                break
            tokens.append(clean)
        if tokens:
            return " ".join(reversed(tokens))
    candidates = []
    for m in re.finditer(r"\b(?:in|at|for|of|about|from)\s+(.+?)\s+hospital\b", question, re.IGNORECASE):
        name = m.group(1).strip()
        if name and len(name) < 45:
            tokens = [t for t in name.split() if t.lower() not in _HOSPITAL_STOPWORDS]
            if tokens:
                candidates.append(" ".join(tokens))
    for name in candidates:
        if name:
            return name
    return None


def _fallback_intent(question: str, history: Optional[List[dict]] = None) -> dict:
    lowered = question.lower()
    doctor_name = _extract_doctor_name(question)
    hospital_name = _extract_hospital_name(question)
    if not doctor_name and history:
        doctor_name = _reuse_doctor_from_history(history)

    if "appointment" in lowered or "booking" in lowered:
        if "my" in lowered or "i have" in lowered:
            return {"intent": "patient_appointments", "doctor_name": None, "hospital_name": None}
        return {"intent": "appointment_information", "doctor_name": doctor_name, "hospital_name": hospital_name}

    is_schedule = (
        "schedule" in lowered or "timing" in lowered or "see patients" in lowered
        or ("when" in lowered and ("available" in lowered or "see" in lowered or "working" in lowered))
        or ("is dr" in lowered and "available" in lowered)
        or ("available" in lowered and doctor_name
            and "which doctors" not in lowered and "doctors are" not in lowered)
    )
    if is_schedule:
        return {"intent": "doctor_schedule", "doctor_name": doctor_name, "hospital_name": hospital_name}

    if "review" in lowered or "rating" in lowered or "feedback" in lowered or "star" in lowered:
        return {"intent": "hospital_reviews", "doctor_name": doctor_name, "hospital_name": hospital_name}

    if "which hospitals" in lowered or ("where" in lowered and doctor_name and "hospital" not in lowered):
        return {"intent": "doctor_hospitals", "doctor_name": doctor_name, "hospital_name": None}
    if ("where" in lowered and "work" in lowered and doctor_name):
        return {"intent": "doctor_hospitals", "doctor_name": doctor_name, "hospital_name": None}

    if ("doctors" in lowered or "doctor list" in lowered or "who are the doctors" in lowered) \
            and "hospital" in lowered:
        return {"intent": "hospital_doctors", "doctor_name": None, "hospital_name": hospital_name}

    if hospital_name and ("about" in lowered or "where is" in lowered or "services" in lowered
                          or "information" in lowered or "tell me" in lowered or "located" in lowered):
        return {"intent": "hospital_information", "doctor_name": None, "hospital_name": hospital_name}

    if doctor_name:
        return {"intent": "doctor_information", "doctor_name": doctor_name, "hospital_name": hospital_name}
    return {"intent": "general_question", "doctor_name": None, "hospital_name": None}


_RESCUE_QUESTION_WORDS = {
    "what", "whats", "who", "whos", "where", "when", "why", "how", "is", "are",
    "am", "do", "does", "did", "can", "could", "would", "should", "which", "tell",
    "me", "about", "the", "a", "an", "of", "for", "in", "at", "on", "show", "give",
    "get", "find", "please", "hi", "hello", "hey", "and", "or", "to", "know",
}


def _rescue_candidate(question: str) -> Optional[str]:
    """Extract a short name-like fragment worth resolving against the DB."""
    text = re.sub(r"[^\w\s.'-]", " ", question)
    tokens = text.split()
    meaningful = [
        token for token in tokens
        if token.lower() not in _RESCUE_QUESTION_WORDS and not token.isdigit()
    ]
    if not meaningful or len(meaningful) > 4:
        return None
    candidate = " ".join(meaningful).strip(" .'-")
    return candidate or None


async def _rescue_entity(question: str) -> Optional[dict]:
    """Resolve a short, name-like fragment to a real hospital/doctor in the DB."""
    candidate = _rescue_candidate(question)
    if not candidate:
        return None
    try:
        found = await knowledge_service.find_entity_by_text(candidate)
    except Exception:
        return None
    if not found:
        return None
    if found["kind"] == "hospital":
        return {
            "intent": "hospital_information",
            "doctor_name": None,
            "hospital_name": found["entity"].get("title", ""),
            "note": "",
            "_kind": "hospital",
        }
    return {
        "intent": "doctor_information",
        "doctor_name": found["entity"].get("fullname", ""),
        "hospital_name": None,
        "note": "",
        "_kind": "doctor",
    }


_DOCTOR_INTENTS = {"doctor_information", "doctor_hospitals", "doctor_schedule"}
_HOSPITAL_INTENTS = {"hospital_information", "hospital_doctors", "hospital_reviews"}


async def detect_intent(question: str, history: List[dict]) -> dict:
    if not has_data_trigger(question):
        rescued = await _rescue_entity(question)
        return rescued or {
            "intent": "general_question", "doctor_name": None, "hospital_name": None, "note": "",
        }

    try:
        result = await asyncio.to_thread(ai_service.classify_intent, question, history)
    except AIProviderError:
        result = _fallback_intent(question, history)
    except Exception:
        result = _fallback_intent(question, history)

    if result.get("intent") not in DATA_INTENTS:
        rescued = await _rescue_entity(question)
        return rescued or result

    rescued = await _rescue_entity(question)
    if rescued:
        kind = rescued.get("_kind")
        classified = result.get("intent")
        if kind == "hospital" and classified in _DOCTOR_INTENTS:
            return rescued
        if kind == "doctor" and classified in _HOSPITAL_INTENTS:
            return rescued
    return result


# --------------------------------------------------------------------------- #
# Final answer generation
# --------------------------------------------------------------------------- #
def _format_context(context: dict) -> str:
    return json.dumps(context, ensure_ascii=False, indent=2, default=str)


def _build_final_prompt(question: str, history: List[dict],
                        context: Optional[dict], note: str) -> str:
    parts = []
    if history:
        parts.append("CONVERSATION SO FAR:\n" + "\n".join(
            f"{m['role'].upper()}: {m['content']}" for m in history
        ))
        parts.append("")
    parts.append(f"TODAY'S DATE: {date.today().isoformat()}")
    parts.append("QUESTION: " + question)
    if note:
        parts.append("NOTE (also answer this general part separately): " + note)
    if context is not None:
        parts.append("")
        parts.append("DATABASE CONTEXT (source of truth for app-specific facts):")
        parts.append(_format_context(context))
    return "\n".join(parts)


def _provider_error_message() -> str:
    provider = os.getenv("AI_PROVIDER", "deepseek").strip().lower()
    if provider == "gemini":
        return "The AI assistant is temporarily unavailable. Please check the Gemini configuration and try again."
    return "The AI assistant is temporarily unavailable. Please check the DeepSeek configuration and try again."


def _ask_llm(question: str, history: List[dict],
             context: Optional[dict], note: str) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    final_prompt = _build_final_prompt(question, history, context, note)
    messages.append({"role": "user", "content": final_prompt})
    return ai_service.chat(messages, temperature=0.4, max_tokens=1024)


# --------------------------------------------------------------------------- #
# Orchestration
# --------------------------------------------------------------------------- #
def _no_entity_messages() -> dict:
    return {
        "doctor_hospitals": "Please tell me which doctor you'd like to look up.",
        "hospital_doctors": "Please tell me which hospital you'd like to see doctors for.",
        "doctor_schedule": "Please tell me which doctor's schedule you'd like to see.",
        "hospital_information": "Please tell me which hospital you'd like information about.",
        "hospital_reviews": "Please tell me which hospital you'd like reviews for.",
        "doctor_information": "Please tell me which doctor you'd like to know about.",
    }


def _reuse_doctor_from_history(history: List[dict]) -> Optional[str]:
    for message in reversed(history):
        text = (message.get("content") or "") if isinstance(message, dict) else ""
        name = _extract_doctor_name(text)
        if name:
            return name
    return None


async def _fetch_context(intent: str, doctor_name: Optional[str],
                         hospital_name: Optional[str], user_id: Optional[str]):
    if intent == "doctor_hospitals":
        return await knowledge_service.get_hospitals_for_doctor(doctor_name)
    if intent == "hospital_doctors":
        return await knowledge_service.get_doctors_for_hospital(hospital_name)
    if intent == "doctor_schedule":
        return await knowledge_service.get_doctor_schedule(doctor_name, hospital_name)
    if intent == "hospital_information":
        return await knowledge_service.get_hospital_information(hospital_name)
    if intent == "hospital_reviews":
        return await knowledge_service.get_hospital_reviews(hospital_name)
    if intent == "doctor_information":
        return await knowledge_service.get_doctor_information(doctor_name)
    if intent in ("patient_appointments", "appointment_information"):
        return await knowledge_service.get_patient_appointments(user_id)
    return None


async def _resolve_history(user_id: Optional[str], conversation,
                           conversation_id) -> List[dict]:
    """Choose the history source for the LLM.

    Priority: persistent conversation (by id) -> client-supplied turns ->
    server-side in-memory memory. Returns a bounded, clean message list.
    """
    if conversation_id:
        try:
            conv = await chat_history_service.get_conversation(user_id, conversation_id)
        except Exception:
            conv = None
        if conv:
            messages = [
                {"role": msg.get("role", "user"), "content": msg.get("content", "")}
                for msg in conv.get("messages", [])
                if msg.get("role") in ("user", "assistant")
            ]
            return messages[-8:]
        return []
    if conversation:
        return _conversation_from_client(conversation)
    return _get_history(user_id)


async def answer_question(question: str, user_id: Optional[str],
                          conversation=None, conversation_id: Optional[str] = None) -> dict:
    question = (question or "").strip()
    if not question:
        return {"response": "Please type a message."}

    history = await _resolve_history(user_id, conversation, conversation_id)

    intent_info = await detect_intent(question, history)
    intent = ai_service.normalize_intent(intent_info.get("intent"))
    doctor_name = intent_info.get("doctor_name")
    hospital_name = intent_info.get("hospital_name")
    note = intent_info.get("note") or ""

    answer = None

    if intent in DATA_INTENTS:
        if intent in ENTITY_REQUIRED:
            required = ENTITY_REQUIRED[intent]
            if required == "doctor_name" and not doctor_name:
                doctor_name = _reuse_doctor_from_history(history)
            value = doctor_name if required == "doctor_name" else hospital_name
            if not value:
                return {"response": _no_entity_messages().get(
                    intent, "Could you be more specific about what you're looking for?")}

        result = await _fetch_context(intent, doctor_name, hospital_name, user_id)
        if result is not None and result.status != "ok":
            return {"response": result.message}

        context = result.context if result else None
        if intent in NO_ENTITY_INTENTS and context is None:
            pass
        answer = await asyncio.to_thread(_ask_llm, question, history, context, note)
    else:
        answer = await asyncio.to_thread(_ask_llm, question, history, None, note)

    answer = (answer or "").strip()
    _push_turn(user_id, question, answer)

    persisted_id = conversation_id
    try:
        persisted_id = await chat_history_service.append_turn_and_maybe_create(
            user_id, persisted_id, question, answer)
    except Exception:
        persisted_id = conversation_id

    return {"response": answer, "conversation_id": persisted_id}
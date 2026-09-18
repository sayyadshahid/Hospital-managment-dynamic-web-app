import json
import os
import re

class AIProviderError(Exception):
    """Raised when the configured AI provider cannot be used."""


def _provider_name() -> str:
    return os.getenv("AI_PROVIDER", "deepseek").strip().lower()


def resolve_provider() -> str:
    return _provider_name()


# --------------------------------------------------------------------------- #
# DeepSeek (chat completions, OpenAI-compatible API)
# --------------------------------------------------------------------------- #
def deepseek_chat(messages, temperature: float = 0.7, max_tokens: int = 1200,
                  json_mode: bool = False) -> str:
    api_key = (os.getenv("DEEPSEEK_API_KEY") or "").strip()
    if not api_key:
        raise AIProviderError("DeepSeek API key not configured. "
                              "Set DEEPSEEK_API_KEY in the backend .env and restart.")

    model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat").strip() or "deepseek-chat"
    base_url = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com").strip()

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key, base_url=base_url, timeout=60.0)
        kwargs = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}
        resp = client.chat.completions.create(**kwargs)
        content = resp.choices[0].message.content or ""
        return content.strip()
    except AIProviderError:
        raise
    except Exception as exc:
        raise AIProviderError(f"DeepSeek request failed: {exc}") from exc


def _extract_json(raw: str) -> dict:
    """Robustly parse a JSON object out of a model response."""
    if not raw:
        return {}
    text = raw.strip()
    fence = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if fence:
        text = fence.group(1).strip()
    try:
        return json.loads(text)
    except Exception:
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except Exception:
                return {}
        return {}


# --------------------------------------------------------------------------- #
# Gemini (optional fallback provider, preserved from existing integration)
# --------------------------------------------------------------------------- #
def gemini_chat(messages, temperature: float = 0.7, max_tokens: int = 1200) -> str:
    api_key = (os.getenv("GEMINI_API_KEY") or "").strip()
    if not api_key:
        raise AIProviderError("Gemini API key not configured. "
                              "Set GEMINI_API_KEY in the backend .env and restart.")

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash").strip() or "gemini-1.5-flash"
        model = genai.GenerativeModel(model_name)

        history = []
        for message in messages[:-1]:
            role = "model" if (message.get("role") or "").lower() in ("assistant", "model") else "user"
            history.append({"role": role, "parts": [message.get("content", "")]})

        chat = model.start_chat(history=history)
        resp = chat.send_message(
            messages[-1].get("content", ""),
            generation_config=genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            ),
        )
        return (resp.text or "").strip()
    except AIProviderError:
        raise
    except Exception as exc:
        raise AIProviderError(f"Gemini request failed: {exc}") from exc


# --------------------------------------------------------------------------- #
# Unified provider entry point
# --------------------------------------------------------------------------- #
def chat(messages, temperature: float = 0.7, max_tokens: int = 1200,
         json_mode: bool = False) -> str:
    provider = _provider_name()
    if provider == "gemini":
        return gemini_chat(messages, temperature=temperature, max_tokens=max_tokens)
    return deepseek_chat(messages, temperature=temperature,
                         max_tokens=max_tokens, json_mode=json_mode)


def classify_intent(question: str, history) -> dict:
    """Ask the LLM to classify the question into an intent + entities (JSON)."""
    system = (
        "You are the query-intent classifier for a hospital management system AI assistant. "
        "Given the conversation history and the latest user question, classify the question.\n"
        "Respond with ONLY valid JSON having exactly these keys:\n"
        '- "intent": one of doctor_hospitals, hospital_doctors, doctor_schedule, '
        "hospital_information, patient_appointments, appointment_information, "
        "hospital_reviews, doctor_information, general_health, general_question, unknown\n"
        '- "doctor_name": extracted doctor name WITHOUT any "Dr " prefix, or null\n'
        '- "hospital_name": extracted hospital name, or null\n'
        '- "note": short text (may be empty)\n'
        "Rules:\n"
        "- doctor_hospitals: asking where / at which hospitals a doctor works.\n"
        "- hospital_doctors: asking which doctors work at a hospital.\n"
        "- doctor_schedule: asking when a doctor is available / their schedule / timings.\n"
        "- hospital_information: asking about / address / services of a hospital.\n"
        "- patient_appointments: user asks about THEIR OWN appointments (status, list, next).\n"
        "- appointment_information: user asks a specific detail about their booking(s).\n"
        "- hospital_reviews: asking about reviews, ratings or feedback for a hospital (or its doctors).\n"
        "- doctor_information: asking about a doctor's profile, specialization or background.\n"
        "- general_health: general medical / health knowledge question (no app data needed).\n"
        "- general_question: other general questions.\n"
        "- unknown: cannot determine.\n"
        "If the question mixes application data AND general health, pick the app-data intent "
        "and capture the general part in 'note'.\n"
        "Resolve pronouns ('his', 'her', 'there', 'this doctor', 'my') using the history to "
        "fill doctor_name/hospital_name.\n"
        "Never invent a name that is not present in the question or history - use null.\n"
        'For patient appointments, doctor_name/hospital_name should normally be null unless '
        "explicitly mentioned."
    )

    lines = ["CONVERSATION SO FAR:"]
    for message in (history or []):
        role = (message.get("role") or "user").upper()
        lines.append(f"{role}: {message.get('content', '')}")
    lines.append("LATEST QUESTION:")
    lines.append(question)

    raw = deepseek_chat(
        [{"role": "system", "content": system},
         {"role": "user", "content": "\n".join(lines)}],
        temperature=0.0,
        max_tokens=300,
        json_mode=True,
    )
    data = _extract_json(raw)

    intent = normalize_intent(data.get("intent"))
    return {
        "intent": intent,
        "doctor_name": _nullable_name(data.get("doctor_name")),
        "hospital_name": _nullable_name(data.get("hospital_name")),
        "note": str(data.get("note") or ""),
    }


def normalize_intent(intent) -> str:
    if not intent:
        return "general_question"
    value = str(intent).strip().lower().replace(" ", "_").replace("-", "_")
    synonyms = {
        "doctor_hospitals": "doctor_hospitals",
        "which_hospitals_doctor": "doctor_hospitals",
        "doctors_hospitals": "doctor_hospitals",
        "hospital_doctors": "hospital_doctors",
        "doctors_at_hospital": "hospital_doctors",
        "doctor_schedule": "doctor_schedule",
        "doctor_availability": "doctor_schedule",
        "doctor_timings": "doctor_schedule",
        "hospital_information": "hospital_information",
        "hospital_info": "hospital_information",
        "patient_appointments": "patient_appointments",
        "my_appointments": "patient_appointments",
        "appointment_information": "appointment_information",
        "appointment_status": "appointment_information",
        "hospital_reviews": "hospital_reviews",
        "reviews": "hospital_reviews",
        "doctor_information": "doctor_information",
        "doctor_info": "doctor_information",
        "general_health": "general_health",
        "health_question": "general_health",
        "general_question": "general_question",
        "general": "general_question",
        "unknown": "unknown",
    }
    return synonyms.get(value, value if value in _ALL_INTENTS else "unknown")


_ALL_INTENTS = {
    "doctor_hospitals", "hospital_doctors", "doctor_schedule",
    "hospital_information", "patient_appointments", "appointment_information",
    "hospital_reviews", "doctor_information", "general_health",
    "general_question", "unknown",
}


def _nullable_name(value):
    if not value:
        return None
    text = str(value).strip()
    return text or None
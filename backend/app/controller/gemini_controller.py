from typing import Optional

from app.services.assistant_service import answer_question


async def generate_ai_response(question: str, user_id: Optional[str] = None,
                               conversation=None, conversation_id: Optional[str] = None) -> dict:
    return await answer_question(question, user_id, conversation, conversation_id)
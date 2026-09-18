from fastapi import APIRouter, HTTPException, Request
from ..models.gemini_model import PromptRequest
from ..controller.gemini_controller import generate_ai_response
from ..services import chat_history_service

router = APIRouter()


def _require_user(request: Request) -> str:
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user_id


@router.post("/generate")
async def generate_content(payload: PromptRequest, request: Request):
    try:
        user_id = getattr(request.state, "user_id", None)
        return await generate_ai_response(
            payload.prompt, user_id, payload.conversation, payload.conversation_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="AI service error. Please try again later."
        )


@router.get("/ai/history")
async def list_history(request: Request):
    user_id = _require_user(request)
    try:
        conversations = await chat_history_service.list_conversations(user_id)
        return {"conversations": conversations}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not load chat history.")


@router.get("/ai/history/{conversation_id}")
async def get_history(conversation_id: str, request: Request):
    user_id = _require_user(request)
    try:
        conversation = await chat_history_service.get_conversation(user_id, conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found.")
        return conversation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not load conversation.")


@router.delete("/ai/history/{conversation_id}")
async def delete_history(conversation_id: str, request: Request):
    user_id = _require_user(request)
    try:
        deleted = await chat_history_service.delete_conversation(user_id, conversation_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Conversation not found.")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not delete conversation.")
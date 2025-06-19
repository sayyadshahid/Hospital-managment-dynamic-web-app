from fastapi import APIRouter, HTTPException
from ..models.gemini_model import PromptRequest
from ..controller.gemini_controller import generate_ai_response

router = APIRouter()

@router.post("/generate")
async def generate_content(request: PromptRequest):
    try:
        response_text = generate_ai_response(request.prompt)
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

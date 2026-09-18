from typing import List, Optional
from pydantic import BaseModel

class PromptRequest(BaseModel):
    prompt: str
    conversation: Optional[List[dict]] = None
    conversation_id: Optional[str] = None
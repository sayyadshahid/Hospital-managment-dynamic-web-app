from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ReviewModel(BaseModel):
    user_id: Optional[str] = None 
    review: str = Field(..., description="review")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

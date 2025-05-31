from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ReviewModel(BaseModel):
    user_id: Optional[str] = None 
    review: str = Field(..., description="review")
    rating: int = Field(3, ge=1, le=5, description="Rating from 1 to 5")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

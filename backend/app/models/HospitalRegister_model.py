from pydantic import BaseModel, Field
from datetime import datetime

class HospitalRegisterModel(BaseModel):
    title: str = Field(..., description="title")
    description: str = Field(..., description="description")
    address: str = Field(..., description="address")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

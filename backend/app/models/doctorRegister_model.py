from pydantic import BaseModel, Field
from datetime import datetime

class DoctorRegisterModel(BaseModel):
    name: str = Field(..., description="title")
    experties: str = Field(..., description="description")
    degree: str = Field(..., description="degree")
    about: str = Field(..., description="about")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

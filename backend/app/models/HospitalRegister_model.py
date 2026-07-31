from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class HospitalRegisterModel(BaseModel):
    title: str = Field(..., description="title")
    description: str = Field(..., description="description")
    address: str = Field(..., description="address")
    about: str = Field(..., description="about")
    admin_name: str = Field(..., description="Hospital admin full name")
    admin_email: EmailStr = Field(..., description="Hospital admin email")
    admin_phone: str = Field(..., min_length=10, max_length=15, description="Hospital admin phone")
    admin_password: str = Field(..., min_length=8, description="Hospital admin password")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

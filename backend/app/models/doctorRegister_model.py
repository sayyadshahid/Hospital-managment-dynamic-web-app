from fastapi import HTTPException
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional

class DoctorRegisterModel(BaseModel):
    fullname: str = Field(..., description="Full name of the doctor")
    experties: str = Field(..., description="Area of expertise")
    degree: str = Field(..., description="Doctor's degree")
    about: str = Field(..., description="Doctor's background information")
    email: EmailStr = Field(..., description="Doctor's email address")
    phone_no: str = Field(..., min_length=10, max_length=15, description="Phone number")
    password: str = Field(..., min_length=8, description="Password")
    confirm_password: Optional[str] = None  # <- Make optional or remove entirely
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

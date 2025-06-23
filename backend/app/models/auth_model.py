from enum import Enum
from typing import Optional
from fastapi import HTTPException
from pydantic import BaseModel, Field, EmailStr, model_validator
from datetime import datetime

class UserType(str, Enum):
    doctor = "doctor"
    user = "user"

class SignupRequest(BaseModel):
    fullname: str = Field(..., description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    phone_no: str = Field(..., min_length=10, max_length=15, description="User's phone number")
    password: str = Field(..., min_length=8, description="User's password")
    confirm_password: str = Field(..., description="Password confirmation")
    role: UserType = Field(..., description="User role: 'user' or 'doctor'")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @model_validator(mode="before")
    def validate_passwords(cls, values):
        if values.get("password") != values.get("confirm_password"):
            raise HTTPException(status_code=400, detail="Passwords do not match")
        return values

    def to_db_dict(self):
        """Remove confirm_password before saving to database"""
        data = self.dict()
        data.pop("confirm_password", None)
        return data

class LoginRequestUser(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

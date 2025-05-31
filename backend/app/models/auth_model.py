from enum import Enum
from typing import Optional
from fastapi import HTTPException
from pydantic import BaseModel, Field, EmailStr, model_validator
from datetime import datetime, timezone  

class UserType(str, Enum):
    Doctor= "doctor"
    User = "user"

class SignupRequest(BaseModel):
    fullname: str= Field(..., description="Users fullname")
    email: EmailStr = Field(..., description="user's email address")
    phone_no: str = Field(..., min_length=10, max_length=15, description ="User's phone number")
    password: str = Field(..., min_length=8, description="User's password")
    confirm_password: str = Field(..., description="must matcg the password")
    role: UserType = Field(..., description="User role: user or doctor")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


    @model_validator(mode="before")
    def validate_passwords(cls, values):
        print("Password:", values.get('password'))
        print("Confirm:", values.get('confirm_password'))
        password = values.get('password')
        confirm_password = values.get('confirm_password')
        if password != confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        return values
    
class LoginRequestUser(BaseModel):
    email: str
    password: str
    
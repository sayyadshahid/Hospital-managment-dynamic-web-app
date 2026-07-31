from enum import Enum
from typing import Optional
from fastapi import HTTPException
from pydantic import BaseModel, Field, EmailStr, model_validator
from datetime import datetime

class UserType(str, Enum):
    doctor = "doctor"
    user = "user"
    hospital_admin = "hospital_admin"
    super_admin = "super_admin"

class SignupRequest(BaseModel):
    fullname: str = Field(..., description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    phone_no: str = Field(..., min_length=10, max_length=15, description="User's phone number")
    password: str = Field(..., min_length=8, description="User's password")
    confirm_password: str = Field(..., description="Password confirmation")
    role: UserType = Field(default=UserType.user, description="User role")
    is_active: Optional[bool] = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @model_validator(mode="before")
    def validate_passwords(cls, values):
        if values.get("password") != values.get("confirm_password"):
            raise HTTPException(status_code=400, detail="Passwords do not match")
        return values

class LoginRequestUser(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)

    @model_validator(mode="before")
    def validate_passwords(cls, values):
        if values.get("new_password") != values.get("confirm_password"):
            raise HTTPException(status_code=400, detail="Passwords do not match")
        return values

class SignupOTPRequest(BaseModel):
    fullname: str = Field(..., description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    phone_no: str = Field(..., min_length=10, max_length=15, description="User's phone number")
    password: str = Field(..., min_length=8, description="User's password")
    confirm_password: str = Field(..., description="Password confirmation")

    @model_validator(mode="before")
    def validate_passwords(cls, values):
        if values.get("password") != values.get("confirm_password"):
            raise HTTPException(status_code=400, detail="Passwords do not match")
        return values

class VerifySignupOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

class PaymentOrderRequest(BaseModel):
    appointment_id: str
    amount: int = Field(..., description="Amount in paise")

class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    appointment_id: str

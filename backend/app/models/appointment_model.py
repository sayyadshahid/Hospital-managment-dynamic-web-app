from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime, date, time 
 
class AppointmentModel(BaseModel):
    name: str = Field(..., description='name')
    phone:  str = Field(..., min_length=10, max_length=15, description ="User's phone number")
    email: EmailStr = Field(..., description="user's email address")
    dob: date = Field(..., description='date of birth')
    gender: Literal["Male", "Female"] = Field(..., description="Gender")
    address: str = Field(..., description="Address", min_length=5)
    reasonForConsultation: str = Field(..., description="Reason for consultation", min_length=5)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_success: bool = Field(default=False)
    schedule_date: date = Field(..., description='Schedule date')
    schedule_time: str = Field(..., description='Schedule time')
    
    @field_validator("schedule_date")
    @classmethod
    def validate_schedule_date(cls, v: date) -> date:
        if v < date.today():
            raise ValueError("Schedule date must be today or in the future.")
        return v
 
class UpdateAppointmentModel(BaseModel):
    name: Optional[str] = Field(None, description='Name')
    phone: Optional[str] = Field(None, min_length=10, max_length=15)
    email: Optional[EmailStr] = Field(None)
    dob: Optional[date] = Field(None)
    gender: Optional[Literal["Male", "Female"]] = Field(None)
    address: Optional[str] = Field(None, min_length=5)
    reasonForConsultation: Optional[str] = Field(None, min_length=5)
    is_active: Optional[bool] = Field(None)
    is_success: Optional[bool] = Field(None)
    schedule_date: Optional[date] = Field(None)
    schedule_time: Optional[str] = Field(None)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)


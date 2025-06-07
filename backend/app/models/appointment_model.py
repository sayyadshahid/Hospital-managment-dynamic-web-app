from typing import Literal
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date, time 
 
class AppointmentModel(BaseModel):
    name: str = Field(..., description='name')
    phone: str = Field(..., description='phone')
    email: EmailStr = Field(..., description="user's email address")
    dob: date = Field(..., description='date of birth')
    gender: Literal["Male", "Female"] = Field(..., description="Gender")
    address: str = Field(..., description="Address", min_length=5)
    reasonForConsultation: str = Field(..., description="Reason for consultation", min_length=5)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    schedule_date: date = Field(..., description='Schedule date')
    schedule_time: str = Field(..., description='Schedule time')
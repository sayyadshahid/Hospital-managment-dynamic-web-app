from pydantic import BaseModel, Field, field_validator
from datetime import datetime, date, time
 


class ScheduleModel(BaseModel):
    schedule_date: date = Field(..., description='Schedule date')
    schedule_time: time = Field(..., description='Schedule time')
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

                                                                                                        
    @field_validator("schedule_date")
    @classmethod
    def validate_date(cls, v: date) -> date:
        if v < date.today():
            raise ValueError("Schedule date cannot be in the past.")
        return v

    def get_scheduled_at(self) -> datetime:
        """Combines date and time into a single datetime object."""
        return datetime.combine(self.schedule_date, self.schedule_time)

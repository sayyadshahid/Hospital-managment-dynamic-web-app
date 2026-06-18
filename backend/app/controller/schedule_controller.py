from fastapi import HTTPException, Request
from app.models.schedule_model import ScheduleModel


DUMMY_SCHEDULES = [
    {
        "schedule_id": "770e8400-e29b-41d4-a716-446655440002",
        "schedule_date": "2026-07-15T00:00:00",
        "schedule_time": "09:00 AM",
        "docId": "660e8400-e29b-41d4-a716-446655440001"
    },
    {
        "schedule_id": "770e8400-e29b-41d4-a716-446655440003",
        "schedule_date": "2026-07-15T00:00:00",
        "schedule_time": "10:30 AM",
        "docId": "660e8400-e29b-41d4-a716-446655440001"
    },
    {
        "schedule_id": "770e8400-e29b-41d4-a716-446655440004",
        "schedule_date": "2026-07-16T00:00:00",
        "schedule_time": "02:00 PM",
        "docId": "660e8400-e29b-41d4-a716-446655440001"
    },
    {
        "schedule_id": "770e8400-e29b-41d4-a716-446655440005",
        "schedule_date": "2026-07-16T00:00:00",
        "schedule_time": "03:30 PM",
        "docId": "660e8400-e29b-41d4-a716-446655440001"
    }
]

class Schedule():
    async def createScheduleByDocId(data: ScheduleModel, docId: str, request: Request):
        return {"msg": "Schedule added successfully"}

    async def getAllSchedulesByDocId(docId: str):
        filtered = [s for s in DUMMY_SCHEDULES if s["docId"] == docId]
        return {'count': len(filtered), 'schedules': filtered}

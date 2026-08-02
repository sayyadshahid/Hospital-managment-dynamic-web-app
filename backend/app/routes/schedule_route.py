from fastapi import APIRouter,  Request
from app.models.schedule_model import ScheduleModel
from app.controller.schedule_controller import Schedule

schedule_router= APIRouter()

@schedule_router.post('/create_schedule/{docId}')
async def createScheduleByDocID(docId: str, data: ScheduleModel, request: Request):
    return await Schedule.createScheduleByDocId(docId=docId, data=data, request=request)

@schedule_router.get('/get_all_schedules/{docId}')
async def get_all_schedule_by_docId(docId: str):
    return await Schedule.getAllSchedulesByDocId(docId=docId)

@schedule_router.put('/update_schedule/{schedule_id}')
async def update_schedule(schedule_id: str, data: ScheduleModel):
    return await Schedule.updateSchedule(schedule_id=schedule_id, data=data)

@schedule_router.delete('/delete_schedule/{schedule_id}')
async def delete_schedule(schedule_id: str):
    return await Schedule.deleteSchedule(schedule_id=schedule_id)
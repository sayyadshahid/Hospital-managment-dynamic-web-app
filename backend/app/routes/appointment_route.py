from fastapi import APIRouter,  Request
from app.models.appointment_model import AppointmentModel
from app.controller.appoinrment_controller import Appointment

appointment_router= APIRouter()

@appointment_router.post('/create_appointment/{docId}')
async def createScheduleByDocID(docId: str, data: AppointmentModel, request: Request):
    return await Appointment.addAppointmentByDocId(docId=docId, data=data, request=request)

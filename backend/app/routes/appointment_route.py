from fastapi import APIRouter,  Request
from app.models.appointment_model import AppointmentModel
from app.controller.appoinrment_controller import Appointment

appointment_router= APIRouter()

@appointment_router.post('/create_appointment/{docId}')
async def createScheduleByDocID(docId: str, data: AppointmentModel, request: Request):
    return await Appointment.addAppointmentByDocId(docId=docId, data=data, request=request)


@appointment_router.get('/get-appointment-by/{id}')
async def get_appointment_by_id(id: str):
    return await Appointment.getAppointmentById(id=id)

@appointment_router.get('/get-all-appointments-by-userid/{userId}')
async def get_appointment_by_userId(userId: str):
    return await Appointment.getAllAppointmentsByUserId(userId= userId)
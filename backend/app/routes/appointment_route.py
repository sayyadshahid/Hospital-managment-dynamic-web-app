from fastapi import APIRouter,  Request
from app.models.appointment_model import AppointmentModel, UpdateAppointmentModel
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


@appointment_router.get('/get-all-appointments-by-docId/{docId}')
async def get_appointment_by_docId(docId: str):
    return await Appointment.getAllAppointmentsByDocId(docId= docId)


@appointment_router.get('/get-all-appointments')
async def get_all_appointments():
    return await Appointment.getAllAppointments()

@appointment_router.put('/update-appointment/{appointment_id}')
async def update_appointment(appointment_id: str, data: UpdateAppointmentModel):
    return await Appointment.UpdateAppointment(appointment_id= appointment_id, data=data)
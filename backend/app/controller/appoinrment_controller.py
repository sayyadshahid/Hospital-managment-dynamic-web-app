from fastapi import HTTPException, Request
from app.models.appointment_model import AppointmentModel, UpdateAppointmentModel


DUMMY_APPOINTMENTS = [
    {
        "id": "880e8400-e29b-41d4-a716-446655440005",
        "name": "John Doe",
        "phone": "+91 1234567890",
        "email": "john.doe@example.com",
        "dob": "1990-05-20",
        "gender": "Male",
        "address": "456 Main Street, Apt 2B, New York, NY 10002",
        "reasonForConsultation": "Chest pain and shortness of breath for the past week",
        "schedule_date": "2026-07-15T00:00:00",
        "schedule_time": "09:00 AM",
        "status": "pending",
        "is_success": False,
        "user_id": "111e8400-e29b-41d4-a716-446655440010",
        "docId": "660e8400-e29b-41d4-a716-446655440001",
        "appointment_id": "880e8400-e29b-41d4-a716-446655440005"
    },
    {
        "id": "880e8400-e29b-41d4-a716-446655440006",
        "name": "Jane Smith",
        "phone": "+91 9876543210",
        "email": "jane.smith@example.com",
        "dob": "1985-11-15",
        "gender": "Female",
        "address": "123 Oak Avenue, Los Angeles, CA 90001",
        "reasonForConsultation": "Regular checkup and blood work",
        "schedule_date": "2026-07-16T00:00:00",
        "schedule_time": "10:30 AM",
        "status": "pending",
        "is_success": True,
        "user_id": "111e8400-e29b-41d4-a716-446655440010",
        "docId": "660e8400-e29b-41d4-a716-446655440002",
        "appointment_id": "880e8400-e29b-41d4-a716-446655440006"
    }
]

class Appointment():

    async def addAppointmentByDocId(data: AppointmentModel, request: Request, docId: str):
        return {
            "msg": "appointment added successfully",
            "appointment_id": "880e8400-e29b-41d4-a716-446655440005"
        }

    async def getAppointmentById(id: str):
        appointment = DUMMY_APPOINTMENTS[0]
        return {'details': appointment}

    async def getAllAppointmentsByUserId(userId: str):
        return {"count": len(DUMMY_APPOINTMENTS), "appointments": DUMMY_APPOINTMENTS}

    async def getAllAppointmentsByDocId(docId: str):
        filtered = [a for a in DUMMY_APPOINTMENTS if a["docId"] == docId]
        return {'count': len(filtered), 'appointments': filtered}

    async def getAllAppointments():
        return {"count": len(DUMMY_APPOINTMENTS), "appointments": DUMMY_APPOINTMENTS}

    async def UpdateAppointment(appointment_id: str, data: UpdateAppointmentModel):
        return {"message": "Appointment fully overwritten"}

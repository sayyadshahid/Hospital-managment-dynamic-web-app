from app.models.doctorRegister_model import DoctorRegisterModel
from fastapi import HTTPException, Request, UploadFile


DUMMY_DOCTORS = [
    {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "fullname": "Dr. Sarah Johnson",
        "degree": "MBBS, MD (Cardiology)",
        "experties": "Interventional Cardiology",
        "about": "Dr. Johnson has over 15 years of experience in cardiology and has performed over 5000 successful procedures.",
        "email": "sarah.johnson@hospital.com",
        "phone_no": "9876543201",
        "file_name": "dr_sarah.jpg",
        "file_path": "uploads/doctor1.jpg",
        "hospital_id": "550e8400-e29b-41d4-a716-446655440000",
        "role": "doctor"
    },
    {
        "id": "660e8400-e29b-41d4-a716-446655440002",
        "fullname": "Dr. Michael Chen",
        "degree": "MBBS, MS (Orthopedics)",
        "experties": "Joint Replacement Surgery",
        "about": "Dr. Chen is a renowned orthopedic surgeon specializing in minimally invasive joint replacements.",
        "email": "michael.chen@hospital.com",
        "phone_no": "9876543202",
        "file_name": "dr_michael.jpg",
        "file_path": "uploads/doctor2.jpg",
        "hospital_id": "550e8400-e29b-41d4-a716-446655440000",
        "role": "doctor"
    },
    {
        "id": "660e8400-e29b-41d4-a716-446655440003",
        "fullname": "Dr. Emily Rodriguez",
        "degree": "MBBS, MD (Pediatrics)",
        "experties": "Neonatology",
        "about": "Dr. Rodriguez is a compassionate pediatrician with expertise in newborn care.",
        "email": "emily.rodriguez@hospital.com",
        "phone_no": "9876543203",
        "file_name": "dr_emily.jpg",
        "file_path": "uploads/doctor3.jpg",
        "hospital_id": "550e8400-e29b-41d4-a716-446655440001",
        "role": "doctor"
    }
]

class DoctorRegister:
    async def doctor_register(self, hospital_id: str, request: Request, data: DoctorRegisterModel, file: UploadFile):
        return {"msg": "Doctor registered successfully"}

    async def getAllDoctors():
        return {'count': len(DUMMY_DOCTORS), 'Doctors': DUMMY_DOCTORS}

    async def getDoctorById(id: str):
        doctor = DUMMY_DOCTORS[0]
        return {'doctor': doctor}

    async def getAllDoctorsByHospitalId(hospital_id: str):
        filtered = [d for d in DUMMY_DOCTORS if d["hospital_id"] == hospital_id]
        return {'count': len(filtered), 'Doctors': filtered}

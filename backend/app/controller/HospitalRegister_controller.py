from app.models.HospitalRegister_model import HospitalRegisterModel
from fastapi import HTTPException
import os
from fastapi import UploadFile


DUMMY_HOSPITALS = [
    {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "City Hospital & Research Center",
        "description": "A premier multi-specialty hospital with state-of-the-art facilities.",
        "address": "123 Healthcare Ave, Medical District, NY 10001",
        "about": "Founded in 1995, City Hospital has been at the forefront of healthcare innovation, providing top-notch medical services to the community.",
        "file_path": "uploads/hospital1.jpg",
        "rating": 4.5
    },
    {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Green Valley Medical Center",
        "description": "Your trusted partner in health and wellness since 2002.",
        "address": "456 Wellness Blvd, Green Valley, CA 95000",
        "about": "Green Valley Medical Center offers comprehensive healthcare services with a patient-first approach.",
        "file_path": "uploads/hospital2.jpg",
        "rating": 3.8
    },
    {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "title": "Sunrise Children's Hospital",
        "description": "Specialized pediatric care in a child-friendly environment.",
        "address": "789 Kidcare Road, Sunnyvale, TX 75000",
        "about": "Dedicated exclusively to children's health, Sunrise offers expert pediatricians and modern facilities.",
        "file_path": "uploads/hospital3.jpg",
        "rating": 4.2
    }
]

class HospitalRegister:

    async def hospital_register(data, file: UploadFile):
        return {"msg": "Hospital registered successfully"}

    async def get_hospital_by_id(id: str):
        hospital = DUMMY_HOSPITALS[0]
        return {'hospital': hospital}

    async def get_all_hospitals():
        return {'count': len(DUMMY_HOSPITALS), 'Hospitals': DUMMY_HOSPITALS}

    async def delete_hospital(id: str):
        return {'massege': 'Hospital Successfully Deleted..'}

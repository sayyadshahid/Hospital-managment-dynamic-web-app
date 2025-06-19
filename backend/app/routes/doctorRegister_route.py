from fastapi import APIRouter, File, HTTPException, UploadFile, Form, Request
from app.controller.doctorRegister_controller import DoctorRegister
from app.models.doctorRegister_model import DoctorRegisterModel 
from datetime import datetime


doctorregister_router = APIRouter()


@doctorregister_router.post("/register-doctor/{hospital_id}")
async def create_upload_file(
    hospital_id: str,
    request: Request,
    name: str = Form(...),
    experties: str = Form(...),
    degree: str = Form(...),
    about: str = Form(...),
    is_active: bool = Form(...),
    file: UploadFile = File(...), 
    
):
    try:
        data = DoctorRegisterModel(
            name=name,
            degree=degree,
            experties=experties,
            address=degree,
            about=about,
            is_active=is_active
        )
        doctor_instance = DoctorRegister()
        response = await doctor_instance.doctor_register(hospital_id, request, data, file)
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@doctorregister_router.get('/get-all-doctors')
async def get_all_doctors():
    response= await DoctorRegister.getAllDoctors()
    return response 

    
@doctorregister_router.get('/get-all-doctors-by/{hospital_id}')
async def get_all_doctors(hospital_id: str):
    response= await DoctorRegister.getAllDoctorsByHospitalId(hospital_id)
    return response


@doctorregister_router.get('/get-doctor-by-id/{id}')
async def get_doctor_by_id(id: str):
    return await DoctorRegister.getDoctorById(id)
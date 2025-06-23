from fastapi import APIRouter, File, HTTPException, UploadFile, Form, Request
from app.controller.doctorRegister_controller import DoctorRegister
from app.models.doctorRegister_model import DoctorRegisterModel 
from app.services.auth_service import get_password_hash

doctorregister_router = APIRouter()


@doctorregister_router.post("/register-doctor/{hospital_id}")
async def create_upload_file(
    hospital_id: str,
    request: Request,
    fullname: str = Form(...),
    experties: str = Form(...),
    degree: str = Form(...),
    about: str = Form(...),
    email: str = Form(...),
    phone_no: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    is_active: bool = Form(...),
    file: UploadFile = File(...),
):
    try:
        print(password, "==========pass")
        print(confirm_password, "======con")
        if password.strip() != confirm_password.strip():
            raise HTTPException(status_code=400, detail="Passwords do not match")

        hashed_password = get_password_hash(password)

        data = DoctorRegisterModel(
            fullname=fullname,
            experties=experties,
            degree=degree,
            about=about,
            email=email,
            phone_no=phone_no,
            password=hashed_password,
            is_active=is_active,
        )

        doctor_instance = DoctorRegister()
        response = await doctor_instance.doctor_register(hospital_id, request, data, file)
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@doctorregister_router.get('/get-all-doctors')
async def get_all_doctors():
    return await DoctorRegister.getAllDoctors()


@doctorregister_router.get('/get-all-doctors-by/{hospital_id}')
async def get_all_doctors_by_hospital(hospital_id: str):
    return await DoctorRegister.getAllDoctorsByHospitalId(hospital_id)


@doctorregister_router.get('/get-doctor-by-id/{id}')
async def get_doctor_by_id(id: str):
    return await DoctorRegister.getDoctorById(id)

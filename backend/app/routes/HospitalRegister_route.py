from fastapi import APIRouter, File, HTTPException, UploadFile, Form
from app.controller.HospitalRegister_controller import HospitalRegister
from app.models.HospitalRegister_model import HospitalRegisterModel
from datetime import datetime


hospitalregister_router = APIRouter()


@hospitalregister_router.post("/register-hospital/")
async def create_upload_file(
    title: str = Form(...),
    description: str = Form(...),
    address: str = Form(...),
    about: str = Form(...),
    is_active: bool = Form(...),
    file: UploadFile = File(...)
):
    try:
        data = HospitalRegisterModel(
            title=title,
            description=description,
            address=address,
            about=about,
            is_active=is_active
        )
        response = await HospitalRegister.hospital_register(data, file)
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@hospitalregister_router.get("/hospital_id/{id}")
async def get_hospital(id:str):
    return await HospitalRegister.get_hospital_by_id(id)

@hospitalregister_router.get("/hospitals")
async def get_all_hospitals():
    response = await HospitalRegister.get_all_hospitals()
    return response


@hospitalregister_router.delete("/delete_hospital/{id}")
async def delete_hospital(id:str):
    return await HospitalRegister.delete_hospital(id)

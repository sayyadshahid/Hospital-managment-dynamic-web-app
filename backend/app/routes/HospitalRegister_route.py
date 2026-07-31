from fastapi import APIRouter, File, HTTPException, UploadFile, Form
from app.controller.HospitalRegister_controller import HospitalRegister
from app.models.HospitalRegister_model import HospitalRegisterModel

hospitalregister_router = APIRouter()


@hospitalregister_router.post("/register-hospital/")
async def create_upload_file(
    title: str = Form(...),
    description: str = Form(...),
    address: str = Form(...),
    about: str = Form(...),
    admin_name: str = Form(...),
    admin_email: str = Form(...),
    admin_phone: str = Form(...),
    admin_password: str = Form(...),
    is_active: bool = Form(True),
    file: UploadFile | None = File(None)
):
    try:
        data = HospitalRegisterModel(
            title=title, description=description, address=address, about=about,
            admin_name=admin_name, admin_email=admin_email,
            admin_phone=admin_phone, admin_password=admin_password,
            is_active=is_active
        )
        return await HospitalRegister.hospital_register(data, file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@hospitalregister_router.get("/hospital_id/{id}")
async def get_hospital(id: str):
    return await HospitalRegister.get_hospital_by_id(id)


@hospitalregister_router.get("/hospitals")
async def get_all_hospitals():
    return await HospitalRegister.get_all_hospitals()


@hospitalregister_router.delete("/delete_hospital/{id}")
async def delete_hospital(id: str):
    return await HospitalRegister.delete_hospital(id)

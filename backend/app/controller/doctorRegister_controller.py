from app.models.doctorRegister_model import DoctorRegisterModel
from fastapi import HTTPException, Request, UploadFile
from app.database import get_database
from app.constant.constants import DbCollections, UserRole
from bson import ObjectId
import os
import re
from datetime import datetime

class DoctorRegister:
    async def doctor_register(self, hospital_id: str, request: Request, data: DoctorRegisterModel, file: UploadFile):
        try:
            
            user_id = request.state.user_id
            if not user_id:
                raise HTTPException(status_code=400, detail="User not authenticated")

            
            upload_folder = "uploads/"
            os.makedirs(upload_folder, exist_ok=True)
            file_location = os.path.join(upload_folder, file.filename)

            with open(file_location, "wb") as f:
                content = await file.read()
                f.write(content)

            doctor_data = {
                "fullname": data.fullname,
                "experties": data.experties,
                "degree": data.degree,
                "about": data.about,
                "email": data.email.lower(),
                "phone_no": data.phone_no,
                "password": data.password,
                "role": "doctor",
                "is_active": data.is_active,
                "created_at": data.created_at,
                "updated_at": data.updated_at,
                "file_name": file.filename,
                "file_path": file_location,
                "hospital_id": hospital_id,
                "registered_by": ObjectId(user_id)
            }

            
            db = get_database()
            doctor_register_collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]

            
            if await doctor_register_collection.find_one({"email": doctor_data["email"]}):
                raise HTTPException(status_code=400, detail="Email already exists")
            if await doctor_register_collection.find_one({"phone_no": doctor_data["phone_no"]}):
                raise HTTPException(status_code=400, detail="Phone number already exists")

            await doctor_register_collection.insert_one(doctor_data)

            return {
                "msg": "Doctor registered successfully"
            }

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

            
            

    async def getAllDoctors():
        try:
            db = get_database()
            doctor_register_collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]
            doctors = doctor_register_collection.find()

            doctors_list = []
            async for doctor in doctors:
                # Convert _id
                doctor['id'] = str(doctor.pop('_id'))

                # Convert all ObjectId fields to string
                for key, value in doctor.items():
                    if isinstance(value, ObjectId):
                        doctor[key] = str(value)

                doctors_list.append(doctor)

            if not doctors_list:
                raise HTTPException(status_code=404, detail="No Doctors found")

            return {'count': len(doctors_list), 'Doctors': doctors_list}

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")



    async def getDoctorById(id: str):
        try:
            db = get_database()
            doctor_register_collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]

            if not ObjectId.is_valid(id):
                raise HTTPException(status_code=400, detail='Invalid doctor ID format')

            doctor = await doctor_register_collection.find_one({'_id': ObjectId(id)})

            if not doctor:
                raise HTTPException(status_code=404, detail="Doctor not found")

            # Convert MongoDB ObjectId fields to strings
            doctor['id'] = str(doctor.pop('_id'))
            for key, value in doctor.items():
                if isinstance(value, ObjectId):
                    doctor[key] = str(value)

            return {'doctor': doctor}

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
        
        
       

    async def getAllDoctorsByHospitalId(hospital_id: str):
        try:
            db = get_database()
            doctor_register_collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]

            doctors_cursor = doctor_register_collection.find({"hospital_id": hospital_id})
            doctors_list = []

            async for doctor in doctors_cursor:
                # Convert _id and other ObjectIds to string
                doctor['id'] = str(doctor.pop('_id'))

                if 'registered_by' in doctor and isinstance(doctor['registered_by'], ObjectId):
                    doctor['registered_by'] = str(doctor['registered_by'])

                doctors_list.append(doctor)

            if not doctors_list:
                raise HTTPException(status_code=404, detail="No doctors found for this hospital")

            return {'count': len(doctors_list), 'Doctors': doctors_list}

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def update_doctor(self, id: str, request: Request, fullname=None, experties=None, degree=None, about=None, phone_no=None, file: UploadFile | None = None):
        try:
            db = get_database()
            if not ObjectId.is_valid(id):
                raise HTTPException(status_code=400, detail="Invalid doctor ID format")

            doctor = await db[DbCollections.DOCTOR_REGISTER_COLLECTION].find_one({"_id": ObjectId(id)})
            if not doctor:
                raise HTTPException(status_code=404, detail="Doctor not found")

            role = request.state.user_role
            is_self = request.state.user_id == id
            is_admin_of_hospital = role == UserRole.HOSPITAL_ADMIN and str(doctor.get("hospital_id")) == str(request.state.hospital_id)
            if not (is_self or is_admin_of_hospital):
                raise HTTPException(status_code=403, detail="You are not authorized to edit this doctor")

            update_data = {"updated_at": datetime.utcnow()}

            for field, value in [("fullname", fullname), ("experties", experties), ("degree", degree)]:
                if value is not None and str(value).strip():
                    update_data[field] = str(value).strip()
            if about is not None:
                update_data["about"] = str(about).strip()

            if phone_no is not None and str(phone_no).strip():
                phone = str(phone_no).strip()
                if not phone.startswith("+91"):
                    if phone.isdigit() and len(phone) == 10:
                        phone = f"+91{phone}"
                    else:
                        raise HTTPException(status_code=400, detail="Invalid phone number format")
                if not re.match(r"^\+91\d{10}$", phone):
                    raise HTTPException(status_code=400, detail="Invalid phone number format")
                current_phone = doctor.get("phone_no")
                if current_phone and current_phone != phone:
                    dup = await db[DbCollections.DOCTOR_REGISTER_COLLECTION].find_one({"phone_no": phone})
                    if dup and str(dup["_id"]) != id:
                        raise HTTPException(status_code=400, detail="Phone number already in use")
                update_data["phone_no"] = phone

            if file:
                upload_folder = "uploads/"
                os.makedirs(upload_folder, exist_ok=True)
                file_location = os.path.join(upload_folder, f"doctor_{id}_{file.filename}")
                with open(file_location, "wb") as f:
                    content = await file.read()
                    f.write(content)
                update_data["file_name"] = file.filename
                update_data["file_path"] = file_location

            await db[DbCollections.DOCTOR_REGISTER_COLLECTION].update_one({"_id": ObjectId(id)}, {"$set": update_data})
            updated = await db[DbCollections.DOCTOR_REGISTER_COLLECTION].find_one({"_id": ObjectId(id)}, {"password": 0})
            updated["id"] = str(updated.pop("_id"))
            return {"msg": "Doctor profile updated successfully", "doctor": updated}

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

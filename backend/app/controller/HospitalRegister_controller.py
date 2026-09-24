from app.constant.constants import DbCollections, UserRole
from app.models.HospitalRegister_model import HospitalRegisterModel
from app.services.auth_service import get_password_hash
from fastapi import HTTPException, Request, UploadFile
from app.database import get_database
import os
from bson import ObjectId
from datetime import datetime


class HospitalRegister:

    async def hospital_register(data: HospitalRegisterModel, file: UploadFile | None = None):
        try:
            db = get_database()

            existing_admin = await db[DbCollections.USER_COLLECTION].find_one(
                {"email": data.admin_email.lower()}
            )
            if existing_admin:
                raise HTTPException(status_code=400, detail="Admin email already exists")

            hospital_data = data.model_dump(exclude={"admin_password"})
            hospital_data["admin_email"] = data.admin_email.lower()

            if file:
                upload_folder = "uploads/"
                os.makedirs(upload_folder, exist_ok=True)
                file_location = os.path.join(upload_folder, file.filename)
                with open(file_location, "wb") as f:
                    content = await file.read()
                    f.write(content)
                hospital_data["filename"] = file.filename
                hospital_data["file_path"] = file_location
            else:
                hospital_data["filename"] = ""
                hospital_data["file_path"] = ""

            result = await db[DbCollections.HOSPITAL_COLLECTION].insert_one(hospital_data)

            hashed_pw = get_password_hash(data.admin_password)
            admin_user = {
                "fullname": data.admin_name,
                "email": data.admin_email.lower(),
                "phone_no": f"+91{data.admin_phone}",
                "password": hashed_pw,
                "role": UserRole.HOSPITAL_ADMIN,
                "hospital_id": str(result.inserted_id),
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }
            await db[DbCollections.USER_COLLECTION].insert_one(admin_user)

            return {"msg": "Hospital registered successfully. Admin account created."}
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def get_hospital_by_id(id: str):
        try:
            db = get_database()
            if not ObjectId.is_valid(id):
                raise HTTPException(status_code=400, detail="Invalid ID format")
            hospital = await db[DbCollections.HOSPITAL_COLLECTION].find_one({"_id": ObjectId(id)})
            if not hospital:
                raise HTTPException(status_code=404, detail="Hospital not found")
            hospital["id"] = str(hospital.pop("_id"))
            return {"hospital": hospital}
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def get_all_hospitals():
        try:
            db = get_database()
            cursor = db[DbCollections.HOSPITAL_COLLECTION].find()
            hospitals = []
            async for h in cursor:
                h["id"] = str(h.pop("_id"))
                hospitals.append(h)
            if not hospitals:
                raise HTTPException(status_code=404, detail="No Hospitals found")
            return {"count": len(hospitals), "Hospitals": hospitals}
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def delete_hospital(id: str):
        try:
            db = get_database()
            hospital = await db[DbCollections.HOSPITAL_COLLECTION].find_one({"_id": ObjectId(id)})
            if not hospital:
                raise HTTPException(status_code=404, detail="Hospital not found")
            await db[DbCollections.USER_COLLECTION].delete_many({"hospital_id": id, "role": UserRole.HOSPITAL_ADMIN})
            await db[DbCollections.HOSPITAL_COLLECTION].delete_one({"_id": ObjectId(id)})
            return {"msg": "Hospital and associated admin deleted successfully"}
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def update_hospital(id: str, request: Request, title=None, description=None, address=None, about=None, file: UploadFile | None = None):
        try:
            db = get_database()
            if not ObjectId.is_valid(id):
                raise HTTPException(status_code=400, detail="Invalid ID format")
            hospital = await db[DbCollections.HOSPITAL_COLLECTION].find_one({"_id": ObjectId(id)})
            if not hospital:
                raise HTTPException(status_code=404, detail="Hospital not found")

            role = request.state.user_role
            if role == UserRole.HOSPITAL_ADMIN and request.state.hospital_id != id:
                raise HTTPException(status_code=403, detail="You are not authorized to edit this hospital")
            if role not in [UserRole.HOSPITAL_ADMIN, UserRole.SUPER_ADMIN]:
                raise HTTPException(status_code=403, detail="You are not authorized to edit this hospital")

            update_data = {"updated_at": datetime.utcnow()}

            if title is not None and str(title).strip():
                update_data["title"] = str(title).strip()
            if description is not None:
                update_data["description"] = str(description).strip()
            if address is not None and str(address).strip():
                update_data["address"] = str(address).strip()
            if about is not None:
                update_data["about"] = str(about).strip()

            if file:
                upload_folder = "uploads/"
                os.makedirs(upload_folder, exist_ok=True)
                file_location = os.path.join(upload_folder, f"hospital_{id}_{file.filename}")
                with open(file_location, "wb") as f:
                    content = await file.read()
                    f.write(content)
                update_data["filename"] = file.filename
                update_data["file_path"] = file_location

            await db[DbCollections.HOSPITAL_COLLECTION].update_one({"_id": ObjectId(id)}, {"$set": update_data})
            updated = await db[DbCollections.HOSPITAL_COLLECTION].find_one({"_id": ObjectId(id)})
            updated["id"] = str(updated.pop("_id"))
            return {"msg": "Hospital updated successfully", "hospital": updated}
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

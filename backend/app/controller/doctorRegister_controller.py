from app.models.doctorRegister_model import DoctorRegisterModel
from fastapi import HTTPException, Request
from app.database import get_database
from app.constant.constants import DbCollections
import os
from fastapi import UploadFile
from fastapi import HTTPException
from app.database import get_database
from bson import ObjectId

class DoctorRegister:
    async def doctor_register(self, hospital_id: str, request: Request, data, file: UploadFile):
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
            
            doctor_data= data.dict()
            doctor_data['file_name'] = file.filename
            doctor_data['file_path'] = file_location
            doctor_data['hospital_id'] = hospital_id
            
            db = get_database()
            doctor_register_collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]
            result = await doctor_register_collection.insert_one(doctor_data)

            return {
    "msg": "Doctor registered successfully",
     
}


        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
            
            
            
            
        
    async def getAllDoctors():
        try:
            db= get_database()
            doctor_register_collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]
            doctors= doctor_register_collection.find()
            doctors_list= []
            async for doctor in doctors:
                doctor['id'] = str(doctor.pop('_id'))
                doctors_list.append(doctor)
                
            if not doctors_list:
                raise HTTPException(status_code=404, detail="No Hospitals found")

            return {'count': len(doctors_list), 'Doctors': doctors_list}
                     
                   
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
            
            
    async def getDoctorById(id: str):
        try:
            db= get_database()
            doctor_register_collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]
            
            if not ObjectId.is_valid(id):
                  raise HTTPException(status_code=400, detail='Invalid user ID format')

            
            doctor= await doctor_register_collection.find_one({'_id': ObjectId(id)})
            
            if not doctor:
                raise HTTPException(status_code=400, detail="User not found")
            
            doctor['id'] = str(doctor.pop('_id'))
            return {'doctor': doctor}
            
        
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
            
        
        
        
    async def getAllDoctorsByHospitalId(hospital_id: str):
        try:
            db= get_database()
            doctor_register_collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]
            doctors= doctor_register_collection.find({'hospital_id': hospital_id})
            doctors_list= []
            async for doctor in doctors:
                doctor['id'] = str(doctor.pop('_id'))
                doctors_list.append(doctor)
                
            if not doctors_list:
                raise HTTPException(status_code=404, detail="No Hospitals found")

            return {'count': len(doctors_list), 'Doctors': doctors_list}
                     
                   
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
        
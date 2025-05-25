from app.models.HospitalRegister_model import HospitalRegisterModel
from fastapi import HTTPException
from app.database import get_database
from app.constant.constants import DbCollections
import os
from fastapi import UploadFile
from fastapi import HTTPException
from app.database import get_database
from bson import ObjectId

class HospitalRegister:
   
    async def hospital_register(data, file: UploadFile):
        try:
            # Save the uploaded file locally (optional)
            upload_folder = "uploads/"
            os.makedirs(upload_folder, exist_ok=True)  # create folder if not exists
            file_location = os.path.join(upload_folder, file.filename)

            with open(file_location, "wb") as f:
                content = await file.read()
                f.write(content)

 
            hospital_data = data.dict()
            hospital_data["filename"] = file.filename
            hospital_data["file_path"] = file_location
 
            db = get_database()
            hospital_collection = db[DbCollections.HOSPITAL_COLLECTION]
            result = await hospital_collection.insert_one(hospital_data)

            return {"msg": "Hospital registered successfully"}

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    
    async def get_hospital_by_id(id: str):
        try:
            db= get_database()
            hospital_collection = db[DbCollections.HOSPITAL_COLLECTION]
            if not ObjectId.is_valid(id):
                  raise HTTPException(status_code=400, detail='Invalid user ID format')

            hospital = await hospital_collection.find_one({'_id': ObjectId(id)})
            
            if not hospital:
                raise HTTPException(status_code=400, detail="User not found")
            
            
            hospital['id'] = str(hospital.pop('_id'))
            return {'hospital': hospital}
        
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    
    async def get_all_hospitals():
        try:
            db = get_database()
            hospital_collection = db[DbCollections.HOSPITAL_COLLECTION]
            
            Hospitals = hospital_collection.find()
            Hospital_list = []
            
            async for Hospital in Hospitals:
                Hospital['id'] = str(Hospital.pop('_id'))
                Hospital_list.append(Hospital)
                
            if not Hospital_list:
                raise HTTPException(status_code=404, detail="No Courses found")

            return {'count': len(Hospital_list), 'Hospitals': Hospital_list}
            
        
        
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    
    async def delete_hospital(id: str):
        try:
            db= get_database()
            hospital_collection = db[DbCollections.HOSPITAL_COLLECTION]
            
            
            result = await hospital_collection.delete_one({'_id': ObjectId(id)})
            
            if result.deleted_count == 0:
                    raise HTTPException(status_code=404, detail="Hospital not found")

            return {'massege': 'Hospital Successfully Deleted..'}
         
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    
from fastapi import HTTPException, Request
from app.database import get_database
from app.constant.constants import DbCollections
from app.models.appointment_model import  AppointmentModel

class Appointment():
    async def addAppointmentByDocId(data: AppointmentModel, request: Request, docId: str):
        try:
            user_id = request.state.user_id
            if not user_id:
                raise HTTPException(status_code=400, detail="User not authenticated")
            
            data_dict = data.dict()
            data_dict["schedule_date"] = data.schedule_date.isoformat()  
            
            data_dict["dob"] = data.dob.isoformat()
            data_dict["user_id"] = user_id
            data_dict["docId"] = docId
            
            db= get_database()
            appointment_collection= db[DbCollections.APPOINTMENT_COLLECTION]
            result= await appointment_collection.insert_one(data_dict)
            return {"msg": "appointment added successfully"}
        
        
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
            
            
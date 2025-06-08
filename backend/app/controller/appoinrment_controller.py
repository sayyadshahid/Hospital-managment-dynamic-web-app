import re
from bson import ObjectId
from fastapi import HTTPException, Request
from app.database import get_database
from app.constant.constants import DbCollections
from app.models.appointment_model import  AppointmentModel

class Appointment():

    async def addAppointmentByDocId(data: AppointmentModel, request: Request, docId: str):
        try:
            phone_regex = r"^\+91\d{10}$"
            user_id = request.state.user_id
            if not user_id:
                raise HTTPException(status_code=400, detail="User not authenticated")

            # Prepend "+91" if not already present
            if not data.phone.startswith("+91"):
                data.phone = f"+91 {data.phone}"

            # Validate phone number
            if not re.match(phone_regex, data.phone):
                raise HTTPException(status_code=400, detail="Invalid phone number format. Must be +91 followed by 10 digits.")

            # Prepare data
            data_dict = data.dict()
            data_dict["schedule_date"] = data.schedule_date.isoformat()
            data_dict["dob"] = data.dob.isoformat()
            data_dict["user_id"] = user_id
            data_dict["docId"] = docId

            # Save to DB
            db = get_database()
            appointment_collection = db[DbCollections.APPOINTMENT_COLLECTION]
            result = await appointment_collection.insert_one(data_dict)

            return {
                "msg": "appointment added successfully",
                "appointment_id": str(result.inserted_id)
            }

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
        
    
    async def getAppointmentById(id: str):
        try:
            db= get_database()
            
            if not ObjectId.is_valid(id):
                raise HTTPException(status_code=400, detail="Invalid user ID format")

            object_id = ObjectId(id)



            appointment_collection= db[DbCollections.APPOINTMENT_COLLECTION]
            appointment = await appointment_collection.find_one({'_id': object_id})
             
            
            if appointment:
                appointment['id'] = str(appointment.pop('_id'))
                return {
                    'details': appointment
                }
            raise HTTPException(status_code=404, detail="Appointment not found")
          
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
            
            
            
            
    async def getAllAppointmentsByUserId(userId: str):
        try:
            db = get_database()
            appointment_collection = db[DbCollections.APPOINTMENT_COLLECTION]
            
            print(f"Looking for user_id: {userId}")
            appointments = await appointment_collection.find({'user_id': userId}).to_list(length=None)
            
            if not appointments:
                raise HTTPException(status_code=404, detail="No appointment found")

            for appointment in appointments:
                appointment['_id'] = str(appointment['_id'])  
                appointment['appointment_id'] = appointment.pop('_id')

            return {
                'count': len(appointments),
                'appointments': appointments
            }

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

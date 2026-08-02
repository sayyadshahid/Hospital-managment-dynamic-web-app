from fastapi import HTTPException,BackgroundTasks, Request
from app.database import get_database
from app.constant.constants import DbCollections
from app.models.schedule_model import ScheduleModel
from bson import ObjectId
from datetime import datetime

class Schedule():
    async def createScheduleByDocId(data: ScheduleModel, docId: str, request: Request):
        try:
            user_id = request.state.user_id
            if not user_id:
                raise HTTPException(status_code=400, detail="User not authenticated")

            
            data_dict = data.dict()
            data_dict["schedule_date"] = data.schedule_date.isoformat()  
            data_dict["schedule_time"] = data.schedule_time.strftime("%I:%M %p")  
            data_dict["user_id"] = user_id
            data_dict["docId"] = docId
            data_dict["scheduled_at"] = data.get_scheduled_at()
            
            db= get_database()
            schedule_collection = db[DbCollections.SCHEDULE_COLLECTION]
            result= await schedule_collection.insert_one(data_dict)
            return {"msg": "Schedule added successfully"}
        
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error during schedule : error: {str(e)}"
            )

    async def updateSchedule(schedule_id: str, data: ScheduleModel):
        try:
            db = get_database()
            schedule_collection = db[DbCollections.SCHEDULE_COLLECTION]
            if not ObjectId.is_valid(schedule_id):
                raise HTTPException(status_code=400, detail="Invalid schedule ID format")

            existing = await schedule_collection.find_one({"_id": ObjectId(schedule_id)})
            if not existing:
                raise HTTPException(status_code=404, detail="Schedule not found")

            data_dict = data.dict()
            data_dict["schedule_date"] = data.schedule_date.isoformat()
            data_dict["schedule_time"] = data.schedule_time.strftime("%I:%M %p")
            data_dict["scheduled_at"] = data.get_scheduled_at()
            data_dict["updated_at"] = datetime.utcnow()

            await schedule_collection.update_one(
                {"_id": ObjectId(schedule_id)}, {"$set": data_dict}
            )
            return {"msg": "Schedule updated successfully"}

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error during schedule update : error: {str(e)}"
            )

    async def deleteSchedule(schedule_id: str):
        try:
            db = get_database()
            schedule_collection = db[DbCollections.SCHEDULE_COLLECTION]
            if not ObjectId.is_valid(schedule_id):
                raise HTTPException(status_code=400, detail="Invalid schedule ID format")

            result = await schedule_collection.delete_one({"_id": ObjectId(schedule_id)})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Schedule not found")

            return {"msg": "Schedule deleted successfully"}

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error during schedule deletion : error: {str(e)}"
            )

    async def getAllSchedulesByDocId(docId: str):
        try:
            db= get_database()
            schedule_collection = db[DbCollections.SCHEDULE_COLLECTION]
            schedules = schedule_collection.find({'docId': docId})
            schedule_list= []
            
            async for schedule in schedules:
                schedule_id= str(schedule.pop('_id'))
                schedule['schedule_id']= schedule_id
                schedule_list.append(schedule)
                
            if not schedule_list:
                raise HTTPException(status_code=404, detail="No Schedules found")

            return {'count': len(schedule_list), 'schedules': schedule_list}
            
                                
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error during schedule : error: {str(e)}"
            )
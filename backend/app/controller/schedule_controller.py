from fastapi import HTTPException,BackgroundTasks, Request
from app.database import get_database
from app.constant.constants import DbCollections
from app.models.schedule_model import ScheduleModel

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
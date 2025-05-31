from fastapi import HTTPException, Request
from app.database import get_database
from app.constant.constants import DbCollections
from app.models.review_model import ReviewModel
from app.models.auth_model import LoginRequest
from bson import ObjectId

class Review:
      async def ReviewE(self, request: Request, data: ReviewModel):
        try:
             
            user_id = request.state.user_id
            if not user_id:
                raise HTTPException(status_code=400, detail="User not authenticated")

            
            data.user_id = user_id
            
            # Database logic
            db = get_database()
            review_collection = db[DbCollections.REVIEW_COLLECTION]
            result = await review_collection.insert_one(data.dict())
            
            return {"message": "Review added successfully"}
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
        
        
      async def getAllReviews():
        try:
            db = get_database()
            review_collection = db[DbCollections.REVIEW_COLLECTION]
        
            reviews_cursor = review_collection.find()
            review_list = []

            async for review in reviews_cursor:
                review_id = str(review.pop('_id'))
                review['id'] = review_id  # Add the string ID back to the review
                review_list.append(review)  # Add the review to the list


            
            
            if not review_list:
                raise HTTPException(status_code=404, detail="No Reviews found")
            
            

            return {
                "count": len(review_list),
                "reviews": review_list
            }

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")




    #   async def getAllReviews():
    #     try:
    #         db = get_database()
    #         review_collection = db[DbCollections.REVIEW_COLLECTION]
        
    #         reviews_cursor = review_collection.find()
    #         review_list = []

    #         async for review in reviews_cursor:
    #             review_id = str(review.pop('_id'))
    #             review['id'] = review_id  # Add the string ID back to the review
    #             review_list.append(review)  # Add the review to the list


    #         doctors_cursor = db[DbCollections.DOCTOR_COLLECTION].find({}, {"password": 0})
    #         doctors = []
    #         async for doctor in doctors_cursor:
    #             doctor["id"] = str(doctor.pop("_id"))
    #             doctor["role"] = "doctor"
    #             doctors.append(doctor)
            
    #         users_cursor = db[DbCollections.USER_COLLECTION].find({}, {"password": 0})
    #         users = []
    #         async for user in users_cursor:
    #             user["id"] = str(user.pop("_id"))
    #             user["role"] = "user"
    #             users.append(user)

            
    #         all_details = review_list + doctors + users

    #         return {
    #             "count": len(all_details),
    #             "reviews": all_details
    #         }

    #     except HTTPException as exc:
    #         raise exc
    #     except Exception as e:
    #         raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
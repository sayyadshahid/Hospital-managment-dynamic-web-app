from fastapi import HTTPException, Request
from app.database import get_database
from app.constant.constants import DbCollections
from app.models.review_model import ReviewModel
from bson import ObjectId

class Review:
    async def ReviewE(self, hospital_id: str, request: Request, data: ReviewModel):
        try:
            user_id = request.state.user_id
            if not user_id:
                raise HTTPException(status_code=400, detail="User not authenticated")

            
            data_dict = data.dict()
            data_dict["user_id"] = user_id
            data_dict["hospital_id"] = hospital_id
            
            # Database logic
            db = get_database()
            review_collection = db[DbCollections.REVIEW_COLLECTION]
            result = await review_collection.insert_one(data_dict)

            return {"message": "Review added successfully"}
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
        

    async def getAllReviews():
        try:
            db = get_database()
            review_collection = db[DbCollections.REVIEW_COLLECTION]

            # Get all reviews
            reviews_cursor = review_collection.find()
            review_list = []

            async for review in reviews_cursor:
                review_id = str(review.pop('_id'))
                review['id'] = review_id
                review_list.append(review)

            # Get all doctors
            doctors_cursor = db[DbCollections.DOCTOR_COLLECTION].find({}, {"password": 0})
            doctors = []
            async for doctor in doctors_cursor:
                doctor["id"] = str(doctor.pop("_id"))
                doctor["role"] = "doctor"
                doctors.append(doctor)

            # Get all users
            users_cursor = db[DbCollections.USER_COLLECTION].find({}, {"password": 0})
            users = []
            async for user in users_cursor:
                user["id"] = str(user.pop("_id"))
                user["role"] = "user"
                users.append(user)

            # Combine users and doctors into a lookup dictionary
            user_map = {person["id"]: person for person in (doctors + users)}

            # Attach user info to each review
            reviews = []
            for review in review_list:
                user_id = review.get("user_id")
                user = user_map.get(user_id)
                if user:
                    review["user"] = {
                        "fullname": user.get("fullname"),
                        "email": user.get("email"),
                        "role": user.get("role"),
                        "phone_no": user.get("phone_no"),
                        # "is_active": user.get("is_active"),
                        # "created_at": user.get("created_at"),
                        # "updated_at": user.get("updated_at"),
                    }
                reviews.append(review)

            return {
                "count": len(reviews),
                "reviews":     reviews
            }

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
        
        
        
        
        
    async def getAllReviewsByHospitalId(hospital_id: str):
        try:
            db = get_database()
            review_collection = db[DbCollections.REVIEW_COLLECTION]

             
            reviews_cursor = review_collection.find({'hospital_id': hospital_id})
            review_list = []

            async for review in reviews_cursor:
                review_id = str(review.pop('_id'))
                review['id'] = review_id
                review_list.append(review)

            
            doctors_cursor = db[DbCollections.DOCTOR_COLLECTION].find({}, {"password": 0})
            doctors = []
            async for doctor in doctors_cursor:
                doctor["id"] = str(doctor.pop("_id"))
                doctor["role"] = "doctor"
                doctors.append(doctor)

            
            users_cursor = db[DbCollections.USER_COLLECTION].find({}, {"password": 0})
            users = []
            async for user in users_cursor:
                user["id"] = str(user.pop("_id"))
                user["role"] = "user"
                users.append(user)
 
            user_map = {person["id"]: person for person in (doctors + users)}

            
            reviews = []
            for review in review_list:
                user_id = review.get("user_id")
                user = user_map.get(user_id)
                if user:
                    review["user"] = {
                        "fullname": user.get("fullname"),
                        "email": user.get("email"),
                        "role": user.get("role"),
                        "phone_no": user.get("phone_no"),
                         
                    }
                reviews.append(review)

            return {
                "count": len(reviews),
                "reviews":     reviews
            }

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")    
        
        
    async def deleteReviewById(id: str):
        try:
            db = get_database()
            review_collection = db[DbCollections.REVIEW_COLLECTION]
            review = await review_collection.delete_one({'_id': ObjectId(id)})
            if review.deleted_count == 0:
                 raise HTTPException(status_code=404, detail="Review not found")

            return {'massege': 'Review Successfully Deleted..'}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")    
        
            
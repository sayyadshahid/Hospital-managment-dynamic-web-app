from fastapi import HTTPException, Request
from app.database import get_database
from app.constant.constants import DbCollections
from app.models.review_model import ReviewModel
from bson import ObjectId

class Review:
      async def ReviewE(self, request: Request, data: ReviewModel):
        try:
            # Extract user_id from the request state set by middleware
            user_id = request.state.user_id
            if not user_id:
                raise HTTPException(status_code=400, detail="User not authenticated")

            # Add user_id to the review model
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
        
        
        
    
    # async def get_review(user_id: str):
    #     db= get_database()
    #     review_collection= db[DbCollections.REVIEW_COLLECTION]
    #     user_collection= db[DbCollections.USER_COLLECTION]
        
        
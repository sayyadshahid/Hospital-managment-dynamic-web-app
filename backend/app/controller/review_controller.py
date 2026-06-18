from fastapi import HTTPException, Request
from app.models.review_model import ReviewModel


DUMMY_REVIEWS = [
    {
        "id": "990e8400-e29b-41d4-a716-446655440006",
        "review": "Excellent hospital, very clean and professional staff. The doctors are highly knowledgeable.",
        "rating": "5",
        "user_id": "111e8400-e29b-41d4-a716-446655440010",
        "hospital_id": "550e8400-e29b-41d4-a716-446655440000",
        "user": {
            "fullname": "Alice Williams",
            "email": "alice@example.com",
            "role": "user",
            "phone_no": "9876543210"
        }
    },
    {
        "id": "990e8400-e29b-41d4-a716-446655440007",
        "review": "Good hospital with modern equipment. Waiting time could be improved.",
        "rating": "4",
        "user_id": "222e8400-e29b-41d4-a716-446655440020",
        "hospital_id": "550e8400-e29b-41d4-a716-446655440000",
        "user": {
            "fullname": "Bob Smith",
            "email": "bob@example.com",
            "role": "user",
            "phone_no": "9876543211"
        }
    },
    {
        "id": "990e8400-e29b-41d4-a716-446655440008",
        "review": "Best pediatric care in the city. My child recovered very quickly.",
        "rating": "5",
        "user_id": "111e8400-e29b-41d4-a716-446655440010",
        "hospital_id": "550e8400-e29b-41d4-a716-446655440001",
        "user": {
            "fullname": "Alice Williams",
            "email": "alice@example.com",
            "role": "user",
            "phone_no": "9876543210"
        }
    }
]

class Review:
    async def ReviewE(self, hospital_id: str, request: Request, data: ReviewModel):
        return {"message": "Review added successfully"}

    async def getAllReviews():
        return {"count": len(DUMMY_REVIEWS), "reviews": DUMMY_REVIEWS}

    async def getAllReviewsByHospitalId(hospital_id: str):
        filtered = [r for r in DUMMY_REVIEWS if r["hospital_id"] == hospital_id]
        return {"count": len(filtered), "reviews": filtered}

    async def deleteReviewById(id: str):
        return {'massege': 'Review Successfully Deleted..'}

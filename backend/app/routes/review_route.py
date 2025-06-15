 
from fastapi import APIRouter, Body, Request
from app.models.review_model import ReviewModel
from app.controller.review_controller import Review

review_router = APIRouter()

@review_router.post('/review/{hospital_id}')
async def submit_review(hospital_id: str, data: ReviewModel, request: Request):
    review = Review()
    return await review.ReviewE(hospital_id, request=request, data=data)

@review_router.get('/get-all-reviews')
async def get_all_reviews():
    review = await Review.getAllReviews()
    return review


@review_router.get('/get-all-reviews-by/{hospital_id}')
async def get_all_reviews_by_hospital_id(hospital_id: str):
    review = await Review.getAllReviewsByHospitalId(hospital_id)
    return review
    
    
@review_router.delete('/delete-review/{id}')
async def delete_review(id: str):
    return await Review.deleteReviewById(id)
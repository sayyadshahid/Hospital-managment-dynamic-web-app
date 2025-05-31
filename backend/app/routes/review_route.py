from app.models.auth_model import LoginRequest
from fastapi import APIRouter, Body, Request
from app.models.review_model import ReviewModel
from app.controller.review_controller import Review

review_router = APIRouter()

@review_router.post('/review')
async def submit_review(data: ReviewModel, request: Request):
    review = Review()
    return await review.ReviewE(request=request, data=data)

@review_router.get('/get-all-reviews')
async def get_all_reviews():
    review = await Review.getAllReviews()
    return review

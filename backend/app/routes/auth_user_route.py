from app.controller.auth_controller import Auth
from fastapi import APIRouter, BackgroundTasks
from app.models.auth_model import (
    LoginRequestUser, SignupRequest, ForgotPasswordRequest,
    VerifyOTPRequest, ResetPasswordRequest, SignupOTPRequest,
    VerifySignupOTPRequest, PaymentOrderRequest, PaymentVerifyRequest
)

auth_router = APIRouter()


@auth_router.post('/signup')
async def signup(data: SignupRequest, background_tasks: BackgroundTasks):
    return await Auth.signup_controller(data=data, background_tasks=background_tasks)


@auth_router.post('/login')
async def login(data: LoginRequestUser):
    return await Auth.loginUser(data=data)


@auth_router.post('/forgot-password')
async def forgot_password(data: ForgotPasswordRequest):
    return await Auth.forgot_password(data=data)


@auth_router.post('/verify-reset-otp')
async def verify_otp(data: VerifyOTPRequest):
    return await Auth.verify_otp(data=data)


@auth_router.post('/reset-password')
async def reset_password(data: ResetPasswordRequest):
    return await Auth.reset_password(data=data)


@auth_router.post('/send-signup-otp')
async def send_signup_otp(data: SignupOTPRequest):
    return await Auth.send_signup_otp_ctrl(data=data)


@auth_router.post('/verify-signup-otp')
async def verify_signup_otp(data: VerifySignupOTPRequest):
    return await Auth.verify_signup_otp_ctrl(data=data)


@auth_router.post('/create-payment-order')
async def create_payment_order(data: PaymentOrderRequest):
    return await Auth.create_payment(data=data)


@auth_router.post('/verify-payment')
async def verify_payment(data: PaymentVerifyRequest):
    return await Auth.verify_payment(data=data)


@auth_router.get('/users/{id}')
async def get_user_by_id(id: str):
    return await Auth.get_user_by_id(id)


@auth_router.get('/get-all-users')
async def get_all_user():
    return await Auth.get_all_users()

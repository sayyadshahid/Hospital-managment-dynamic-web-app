from app.controller.auth_controller import Auth
from fastapi import APIRouter, BackgroundTasks
from app.models.auth_model import LoginRequestUser, SignupRequest

auth_router = APIRouter()

@auth_router.post('/signup')
async def signup(data: SignupRequest, background_tasks: BackgroundTasks):
    response = await Auth.signup_controller(data=data, background_tasks=background_tasks)
    return response


@auth_router.post('/login')
async def login(data: LoginRequestUser):
    return await Auth.loginUser(data=data)
 

@auth_router.get('/users/{id}')
async def get_user_by_id(id: str):
    return await Auth.get_user_by_id(id)

@auth_router.get('/get-all-users')
async def get_all_user():
    return await Auth.get_all_users()

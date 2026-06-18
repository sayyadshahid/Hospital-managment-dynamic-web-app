from app.models.auth_model import SignupRequest, LoginRequestUser
from fastapi import HTTPException,BackgroundTasks
from app.services.auth_service import create_access_token


from fastapi.responses import JSONResponse


DUMMY_USERS = [
    {"id": "111e8400-e29b-41d4-a716-446655440010", "fullname": "Alice Williams", "email": "alice@example.com", "phone_no": "9876543210", "role": "user"},
    {"id": "222e8400-e29b-41d4-a716-446655440020", "fullname": "Bob Smith", "email": "bob@example.com", "phone_no": "9876543211", "role": "user"},
    {"id": "333e8400-e29b-41d4-a716-446655440030", "fullname": "Dr. Sarah Johnson", "email": "sarah@hospital.com", "phone_no": "9876543212", "role": "doctor"},
    {"id": "444e8400-e29b-41d4-a716-446655440040", "fullname": "Admin User", "email": "admin@hospital.com", "phone_no": "9876543213", "role": "admin"},
]

class Auth():
    async def signup_controller(data: SignupRequest, background_tasks: BackgroundTasks):
        return JSONResponse(content={"msg": f"Signup successful as {data.role}. Please Login Again"}, status_code=200)

    async def signup(collection, data: SignupRequest, background_tasks: BackgroundTasks):
        return {"msg": f"Signup successful as {data.role}. Please Login Again"}

    async def loginUser(data: LoginRequestUser):
        payload = {
            "id": DUMMY_USERS[0]["id"],
            "email": data.email,
            "fullname": DUMMY_USERS[0]["fullname"]
        }
        token = create_access_token(payload)
        return {
            "access_token": token,
            "token_type": "bearer",
            "id": DUMMY_USERS[0]["id"],
            "role": "admin",
            "fullname": DUMMY_USERS[0]["fullname"],
            "email": data.email,
            "msg": "Login successful"
        }

    async def get_user_by_id(id: str):
        user = DUMMY_USERS[0]
        return {"user": user}

    async def get_all_users():
        return {"count": len(DUMMY_USERS), "users": DUMMY_USERS}

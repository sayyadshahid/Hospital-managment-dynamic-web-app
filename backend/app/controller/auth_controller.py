from app.models.auth_model import SignupRequest, LoginRequestUser
from bson import ObjectId
from fastapi import HTTPException,BackgroundTasks
from app.database import get_database
from app.constant.constants import DbCollections
import re
from app.services.auth_service import create_access_token, get_password_hash, verify_password


from fastapi.responses import JSONResponse
class Auth():
    async def signup_controller(data: SignupRequest, background_tasks: BackgroundTasks):
        try:
           db= get_database()
           if data.role == "doctor":
                collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]
           else:
                collection = db[DbCollections.USER_COLLECTION]
           phone_regex = r"^\+91\d{10}$"
           data.phone_no = f"+91{data.phone_no}" 
           if not re.match(phone_regex, data.phone_no):
             raise HTTPException(status_code=400, detail="Invalid phone number format.")
           response = await Auth.signup(collection=collection, data=data,background_tasks=background_tasks)
           return JSONResponse(content=response, status_code=200)
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error during signup : error: {str(e)}"
            )


    async def signup(collection, data: SignupRequest, background_tasks: BackgroundTasks):
        db=get_database()
        email=data.email.lower()
        existing_user = await collection.find_one({"email": email,"is_active":True})
        user_phone_no=await collection.find_one({"phone_no": data.phone_no,"is_active":True})
        try:
            if existing_user:
                    raise HTTPException(status_code=400, detail="User with this email already exists") 
            if user_phone_no:
                raise HTTPException(status_code=400, detail="User with this Phone number already exists")

            new_user = {
                "fullname": data.fullname,
                "phone_no": data.phone_no,
                "email": email,
                "password": data.password, 
                "confirm_password":data.confirm_password,
                "role": data.role
                }
            
            validated_user = SignupRequest(**new_user)

            user_to_insert = validated_user.model_dump(exclude={"confirm_password"})
            user_to_insert["password"] = get_password_hash(validated_user.password)
            await collection.insert_one(user_to_insert)


            return {"msg": f"Signup successful as {data.role}. Please Login Again "}

        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error during signup : error: {str(e)}"
            )
        
    async def loginUser(data: LoginRequestUser):
        try:
            db = get_database()

            # Check in USER collection
            user_collection = db[DbCollections.USER_COLLECTION]
            user = await user_collection.find_one({"email": data.email.lower(), "is_active": True})
            if user and verify_password(data.password, user["password"]):
                payload = {
                    "id": str(user["_id"]),
                    "email": user["email"],
                    "fullname": user["fullname"]
                }
                token = create_access_token(payload)
                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "id": str(user["_id"]),
                    "role": user.get("role", "user"),
                    "fullname": user.get("fullname", 'N/A'),
                    "email": user.get("email", 'N/A'),
                    "msg": "Login successful"
                }

            doctor_collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]
            doc_user = await doctor_collection.find_one({"email": data.email.lower()})
            print(data.email)
            
            
            # print("Doctor doc_user:", doc_user)
            if doc_user:
                print("Stored Password:", doc_user["password"])
                print("Password Match:", verify_password(data.password, doc_user["password"]))

                payload = {
                    "id": str(doc_user["_id"]),
                    "email": doc_user["email"],
                    "fullname": doc_user["fullname"]
                }
                token = create_access_token(payload)
                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "id": str(doc_user["_id"]),
                    "role": 'doctor',
                    "msg": "Login successful"
                }

            raise HTTPException(status_code=401, detail="Invalid email or password")

        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
    
     
     
    async def get_user_by_id(id: str):
        try:
            db = get_database()

            if not ObjectId.is_valid(id):
                raise HTTPException(status_code=400, detail="Invalid user ID format")

            object_id = ObjectId(id)

            doctor = await db[DbCollections.DOCTOR_COLLECTION].find_one(
                {"_id": object_id}, {"password": 0}
            )
            if doctor:
                doctor["id"] = str(doctor.pop("_id"))
                doctor["role"] = "doctor"
                return {"user": doctor}

            user = await db[DbCollections.USER_COLLECTION].find_one(
                {"_id": object_id}, {"password": 0}
            )
            if user:
                user["id"] = str(user.pop("_id"))
                user["role"] = "user"
                return {"user": user}

            raise HTTPException(status_code=404, detail="User not found")

        except HTTPException as http_err:
            raise http_err
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")
        
        
        
        
        
    async def get_all_users():
        try:
            db = get_database()
 
            doctors_cursor = db[DbCollections.DOCTOR_REGISTER_COLLECTION].find({}, {"password": 0})
            doctors = []
            async for doctor in doctors_cursor:
                doctor["id"] = str(doctor.pop("_id"))

                # Manually convert ObjectId fields (if needed)
                if "registered_by" in doctor and isinstance(doctor["registered_by"], ObjectId):
                    doctor["registered_by"] = str(doctor["registered_by"])

                doctor["role"] = "doctor"
                doctors.append(doctor)

            # Fetch all users
            users_cursor = db[DbCollections.USER_COLLECTION].find({}, {"password": 0})
            users = []
            async for user in users_cursor:
                user["id"] = str(user.pop("_id"))
                user["role"] = "user"
                users.append(user)

            all_users = doctors + users

            return {"count": len(all_users) ,"users": all_users}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")
        
        
        
        
        
        
        
from app.models.auth_model import (
    SignupRequest, LoginRequestUser, ForgotPasswordRequest,
    VerifyOTPRequest, ResetPasswordRequest, SignupOTPRequest,
    VerifySignupOTPRequest, PaymentOrderRequest, PaymentVerifyRequest
)
from bson import ObjectId
from fastapi import HTTPException, BackgroundTasks
from app.database import get_database
from app.constant.constants import DbCollections, UserRole
import re
import random
from datetime import datetime, timedelta
from app.services.auth_service import create_access_token, get_password_hash, verify_password
from app.services.email_service import send_password_reset_otp, send_signup_otp
from app.services.razorpay_service import create_payment_order, verify_payment_signature
from fastapi.responses import JSONResponse


class Auth:

    async def send_signup_otp_ctrl(data: SignupOTPRequest):
        try:
            db = get_database()
            email = data.email.lower()
            existing = await db[DbCollections.USER_COLLECTION].find_one({"email": email})
            if existing:
                raise HTTPException(status_code=400, detail="Email already registered")

            phone_regex = r"^\+91\d{10}$"
            phone = f"+91{data.phone_no}"
            if not re.match(phone_regex, phone):
                raise HTTPException(status_code=400, detail="Invalid phone number format")

            otp = str(random.randint(100000, 999999))
            otp_expiry = datetime.utcnow() + timedelta(minutes=10)

            await db[DbCollections.USER_COLLECTION].update_one(
                {"email": email},
                {"$set": {
                    "signup_otp": otp, "signup_otp_expiry": otp_expiry,
                    "fullname": data.fullname, "phone_no": phone,
                    "password": get_password_hash(data.password), "role": UserRole.PATIENT,
                    "is_active": False, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()
                }},
                upsert=True
            )

            sent = await send_signup_otp(email, otp, data.fullname)
            if not sent:
                raise HTTPException(status_code=500, detail="Failed to send OTP")

            return {"msg": "OTP sent to your email", "email": email}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def verify_signup_otp_ctrl(data: VerifySignupOTPRequest):
        try:
            db = get_database()
            email = data.email.lower()
            user = await db[DbCollections.USER_COLLECTION].find_one({"email": email})

            if not user:
                raise HTTPException(status_code=404, detail="No registration found")
            if user.get("signup_otp") != data.otp:
                raise HTTPException(status_code=400, detail="Invalid OTP")
            if user.get("signup_otp_expiry") and user["signup_otp_expiry"] < datetime.utcnow():
                raise HTTPException(status_code=400, detail="OTP has expired")

            await db[DbCollections.USER_COLLECTION].update_one(
                {"email": email},
                {"$set": {"is_active": True}, "$unset": {"signup_otp": "", "signup_otp_expiry": ""}}
            )

            return {"msg": "Registration verified successfully. Please login."}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def signup_controller(data: SignupRequest, background_tasks: BackgroundTasks):
        try:
            db = get_database()
            if data.role in ["doctor", "hospital_admin"]:
                collection = db[DbCollections.DOCTOR_REGISTER_COLLECTION]
            else:
                collection = db[DbCollections.USER_COLLECTION]

            phone_regex = r"^\+91\d{10}$"
            data.phone_no = f"+91{data.phone_no}"
            if not re.match(phone_regex, data.phone_no):
                raise HTTPException(status_code=400, detail="Invalid phone number format.")
            response = await Auth.signup(collection=collection, data=data, background_tasks=background_tasks)
            return JSONResponse(content=response, status_code=200)
        except HTTPException as exc:
            raise exc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during signup : error: {str(e)}")

    async def signup(collection, data: SignupRequest, background_tasks: BackgroundTasks):
        db = get_database()
        email = data.email.lower()
        existing_user = await collection.find_one({"email": email, "is_active": True})
        user_phone_no = await collection.find_one({"phone_no": data.phone_no, "is_active": True})
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
                "confirm_password": data.confirm_password,
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
            raise HTTPException(status_code=500, detail=f"Error during signup : error: {str(e)}")

    async def loginUser(data: LoginRequestUser):
        try:
            db = get_database()
            email = data.email.lower()

            user = await db[DbCollections.USER_COLLECTION].find_one({"email": email, "is_active": True})
            if user and verify_password(data.password, user["password"]):
                role = user.get("role", UserRole.PATIENT)
                payload = {"id": str(user["_id"]), "email": user["email"], "fullname": user["fullname"], "role": role}
                if role == UserRole.HOSPITAL_ADMIN:
                    hospital = await db[DbCollections.HOSPITAL_COLLECTION].find_one({"admin_email": email})
                    if hospital:
                        payload["hospital_id"] = str(hospital["_id"])
                token = create_access_token(payload)
                return {
                    "access_token": token, "token_type": "bearer",
                    "id": str(user["_id"]), "role": role,
                    "fullname": user.get("fullname", ""), "email": user.get("email", ""),
                    "hospital_id": payload.get("hospital_id", ""),
                    "msg": "Login successful"
                }

            doc = await db[DbCollections.DOCTOR_REGISTER_COLLECTION].find_one({"email": email})
            if doc and verify_password(data.password, doc["password"]):
                payload = {
                    "id": str(doc["_id"]), "email": doc["email"],
                    "fullname": doc["fullname"], "role": UserRole.DOCTOR,
                    "hospital_id": str(doc.get("hospital_id", ""))
                }
                token = create_access_token(payload)
                return {
                    "access_token": token, "token_type": "bearer",
                    "id": str(doc["_id"]), "role": UserRole.DOCTOR,
                    "fullname": doc.get("fullname", ""), "email": doc.get("email", ""),
                    "hospital_id": str(doc.get("hospital_id", "")),
                    "msg": "Login successful"
                }

            raise HTTPException(status_code=401, detail="Invalid email or password")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

    async def forgot_password(data: ForgotPasswordRequest):
        try:
            db = get_database()
            email = data.email.lower()
            user = await db[DbCollections.USER_COLLECTION].find_one({"email": email})
            doc_user = await db[DbCollections.DOCTOR_REGISTER_COLLECTION].find_one({"email": email})
            if not user and not doc_user:
                raise HTTPException(status_code=404, detail="No account found with this email")

            otp = str(random.randint(100000, 999999))
            otp_expiry = datetime.utcnow() + timedelta(minutes=10)

            if user:
                await db[DbCollections.USER_COLLECTION].update_one(
                    {"email": email}, {"$set": {"reset_otp": otp, "reset_otp_expiry": otp_expiry}}
                )
            else:
                await db[DbCollections.DOCTOR_REGISTER_COLLECTION].update_one(
                    {"email": email}, {"$set": {"reset_otp": otp, "reset_otp_expiry": otp_expiry}}
                )

            sent = await send_password_reset_otp(email, otp)
            if not sent:
                raise HTTPException(status_code=500, detail="Failed to send OTP email. Please try again later.")
            return {"msg": "OTP sent to your email", "email": email}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def verify_otp(data: VerifyOTPRequest):
        try:
            db = get_database()
            email = data.email.lower()
            user = await db[DbCollections.USER_COLLECTION].find_one({"email": email})
            doc_user = await db[DbCollections.DOCTOR_REGISTER_COLLECTION].find_one({"email": email})
            record = user or doc_user
            if not record:
                raise HTTPException(status_code=404, detail="No account found with this email")
            if record.get("reset_otp") != data.otp:
                raise HTTPException(status_code=400, detail="Invalid OTP")
            if record.get("reset_otp_expiry") and record["reset_otp_expiry"] < datetime.utcnow():
                raise HTTPException(status_code=400, detail="OTP has expired")
            return {"msg": "OTP verified successfully", "email": email}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def reset_password(data: ResetPasswordRequest):
        try:
            db = get_database()
            email = data.email.lower()
            user = await db[DbCollections.USER_COLLECTION].find_one({"email": email})
            doc_user = await db[DbCollections.DOCTOR_REGISTER_COLLECTION].find_one({"email": email})
            record = user or doc_user
            collection_name = DbCollections.USER_COLLECTION if user else DbCollections.DOCTOR_REGISTER_COLLECTION
            if not record:
                raise HTTPException(status_code=404, detail="No account found with this email")
            if record.get("reset_otp") != data.otp:
                raise HTTPException(status_code=400, detail="Invalid OTP")
            if record.get("reset_otp_expiry") and record["reset_otp_expiry"] < datetime.utcnow():
                raise HTTPException(status_code=400, detail="OTP has expired")
            hashed_password = get_password_hash(data.new_password)
            await db[collection_name].update_one(
                {"email": email},
                {"$set": {"password": hashed_password, "updated_at": datetime.utcnow()},
                 "$unset": {"reset_otp": "", "reset_otp_expiry": ""}}
            )
            return {"msg": "Password reset successful. Please login with your new password."}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    async def create_payment(data: PaymentOrderRequest):
        try:
            db = get_database()
            appointment = await db[DbCollections.APPOINTMENT_COLLECTION].find_one(
                {"_id": ObjectId(data.appointment_id)}
            )
            if not appointment:
                raise HTTPException(status_code=404, detail="Appointment not found")

            order = create_payment_order(data.amount)
            await db[DbCollections.APPOINTMENT_COLLECTION].update_one(
                {"_id": ObjectId(data.appointment_id)},
                {"$set": {"razorpay_order_id": order["id"], "payment_amount": data.amount}}
            )
            return {
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "key_id": "rzp_test_T4yJxr1uNxGng1",
                "appointment_id": data.appointment_id
            }
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")

    async def verify_payment(data: PaymentVerifyRequest):
        try:
            valid = verify_payment_signature(data.razorpay_order_id, data.razorpay_payment_id, data.razorpay_signature)
            if not valid:
                raise HTTPException(status_code=400, detail="Payment verification failed")

            await get_database()[DbCollections.APPOINTMENT_COLLECTION].update_one(
                {"_id": ObjectId(data.appointment_id)},
                {"$set": {
                    "payment_id": data.razorpay_payment_id,
                    "payment_status": "paid",
                    "is_success": True
                }}
            )
            return {"msg": "Payment successful", "is_success": True}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")

    async def get_user_by_id(id: str):
        try:
            db = get_database()
            if not ObjectId.is_valid(id):
                raise HTTPException(status_code=400, detail="Invalid user ID format")
            object_id = ObjectId(id)

            for coll, role in [(DbCollections.DOCTOR_REGISTER_COLLECTION, UserRole.DOCTOR),
                               (DbCollections.USER_COLLECTION, None)]:
                record = await db[coll].find_one({"_id": object_id}, {"password": 0})
                if record:
                    record["id"] = str(record.pop("_id"))
                    record["role"] = role or record.get("role", UserRole.PATIENT)
                    return {"user": record}

            raise HTTPException(status_code=404, detail="User not found")
        except HTTPException as http_err:
            raise http_err
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")

    async def get_all_users():
        try:
            db = get_database()
            all_users = []
            for coll in [DbCollections.DOCTOR_REGISTER_COLLECTION, DbCollections.USER_COLLECTION]:
                cursor = db[coll].find({}, {"password": 0})
                async for doc in cursor:
                    doc["id"] = str(doc.pop("_id"))
                    if "registered_by" in doc and isinstance(doc["registered_by"], ObjectId):
                        doc["registered_by"] = str(doc["registered_by"])
                    if "hospital_id" in doc and isinstance(doc["hospital_id"], ObjectId):
                        doc["hospital_id"] = str(doc["hospital_id"])
                    all_users.append(doc)
            return {"count": len(all_users), "users": all_users}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")

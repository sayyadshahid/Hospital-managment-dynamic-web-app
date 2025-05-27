from app.constant.constants import DbCollections
from app.database import get_database
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext


SECRET_KEY = "13fb03a154c6e52d82bbba5aef60080d8863536447ec23781331826d22b227b795140e40154e5b76bf9f8b7d3ed4d0e4b05d96d318aac57f9ce12dfcf44e742e2cd63d9d6ba285d96130a574acc06ffe00689d6bb3df0182de433e4b61b71bc9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60   

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)



async def authenticate_user(email: str, password: str):
    try:
        db=get_database()
        user_collection= db[DbCollections.USER_COLLECTION]
        user = await user_collection.find_one({"email": email,"is_active": True})

        if not user or not verify_password(password, user["password"]):
            return None 

        access_token = create_access_token(data={"sub": str(user["_id"])})
        return {
            "token": access_token,
            "msg": "Login successful",
            "user": {
                "user_id":str(user["_id"]),
                "email": user["email"],
                "fullname": user.get("fullname", ""),
                "phone_no": user.get("phone_no", ""),
                "created_at": user.get("created_at", ""),
                    }
        }

    except Exception as e:
        print(f"Error during authentication: {str(e)}")
        return None
    
    
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        # Check if user exists in the database
        db = get_database()
        user_collection = db[DbCollections.USER_COLLECTION]
        user = user_collection.find_one({"_id": user_id, "is_active": True})
        if not user:
            return {"detail": "User no longer exists or is inactive"}

        return payload
    except jwt.ExpiredSignatureError:
        return {"detail": "Token has expired"}
    except jwt.JWTError:
        return {"detail": "Invalid token"}
 

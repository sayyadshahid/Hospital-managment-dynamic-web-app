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

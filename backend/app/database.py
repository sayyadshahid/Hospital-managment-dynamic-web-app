from dotenv import load_dotenv
load_dotenv()
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
import os

# Load environment variables from .env file

MONGO_DB_UR = os.getenv("MONGO_DB_URL")
DATABASE_NAM = os.getenv("DATABASE_NAME")
 
# print(MONGO_DB_UR, "=========MONGO_DB_UR===")

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    try:
        db.client = AsyncIOMotorClient(MONGO_DB_UR)        # You can optionally validate the connection here
        print("Connected to MongoDB")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

def get_database():
    if not db.client:
        raise Exception("Database client is not initialized. Did you forget to call connect_to_mongo?")
    return db.client[DATABASE_NAM]


from motor.motor_asyncio import AsyncIOMotorClient 

from fastapi import HTTPException

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    try:
        db.client = AsyncIOMotorClient("mongodb+srv://shahidsayyed0212:shahid%40212@cluster0.5nahamz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        if db.client is None or not db.client.is_primary:
            raise Exception("MongoDB connection failed.")
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
    return db.client["hospital-managment"]

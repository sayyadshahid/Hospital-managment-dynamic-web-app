from dotenv import load_dotenv
load_dotenv()
import os
from fastapi import FastAPI, HTTPException,Request
from fastapi.responses import JSONResponse
from app.database import connect_to_mongo,close_mongo_connection
from app.routes.auth_user_route import auth_router
from app.routes.HospitalRegister_route import hospitalregister_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.review_route import review_router
from app.middleware.auth_middleware import JWTAuthenticationMiddleware  
from app.routes.doctorRegister_route import doctorregister_router
from app.routes.schedule_route import schedule_router
from app.routes.appointment_route import appointment_router
from app.routes.gemini_route import router as gemini_router

# Load .env

# Test if the key loads
print("Gemini API Key:", os.getenv("GEMINI_API_KEY"))

app = FastAPI()


app.include_router(auth_router,prefix='/api')
app.include_router(hospitalregister_router, prefix='/api')
app.include_router(review_router, prefix='/api')
app.include_router(doctorregister_router, prefix='/api')
app.include_router(schedule_router, prefix='/api')
app.include_router(appointment_router, prefix='/api')



app.include_router(gemini_router, prefix="/api", tags=["Gemini API"])









app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

#mongoDB only:
@app.on_event("startup") 
async def startup_event():
    await connect_to_mongo()
@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"msg": exc.detail},  
    )



app.add_middleware(JWTAuthenticationMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static") 
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

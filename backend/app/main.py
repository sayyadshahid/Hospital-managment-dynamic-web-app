from fastapi import FastAPI, HTTPException,Request
from fastapi.responses import JSONResponse
from app.database import connect_to_mongo,close_mongo_connection
from app.routes.auth_user_route import auth_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()


app.include_router(auth_router,prefix='/api')















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



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from app.services.auth_service import verify_token

class JWTAuthenticationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        unprotected_paths = ["/api/signup", "/api/login","/docs", "/redoc", "/openapi.json","/api/docs", "/api/redoc",
                             "/media/",' /register-hospital/', '/hospital_id/{id}', '/hospitals', '/delete_hospital/{id}'
                             ]

        if any(request.url.path.startswith(path) for path in unprotected_paths):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return JSONResponse(
                {"detail": "Authorization header is missing"},
                status_code=401,
            )

        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1].strip()
        else:
            token = auth_header.strip()
            
        payload = verify_token(token)
        if not payload:
            return JSONResponse(
                {"detail": "Invalid or expired token"},
                status_code=401,
            )

        request.state.user_id = payload.get("id")
        
        response = await call_next(request)
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response
 
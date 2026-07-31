from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from app.services.auth_service import verify_token

class JWTAuthenticationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        unprotected_paths = [
            "/api/signup", "/api/login",
            "/api/forgot-password", "/api/verify-reset-otp", "/api/reset-password",
            "/api/send-signup-otp", "/api/verify-signup-otp",
            "/docs", "/redoc", "/openapi.json", "/api/docs", "/api/redoc",
            "/uploads/", "/register-hospital/", "/api/hospitals",
            "/api/hospital_id/", "/api/get-all-doctors", "/api/get-all-reviews",
        ]

        if any(request.url.path.startswith(path) for path in unprotected_paths):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return JSONResponse({"detail": "Authorization header is missing"}, status_code=401)

        token = auth_header.split(" ")[1].strip() if auth_header.startswith("Bearer ") else auth_header.strip()
        payload = verify_token(token)
        if not payload:
            return JSONResponse({"detail": "Invalid or expired token"}, status_code=401)

        request.state.user_id = payload.get("id")
        request.state.user_role = payload.get("role")
        request.state.hospital_id = payload.get("hospital_id", "")
        request.state.fullname = payload.get("fullname", "")

        response = await call_next(request)
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

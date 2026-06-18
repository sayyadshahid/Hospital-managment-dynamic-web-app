from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


DUMMY_USER_ID = "111e8400-e29b-41d4-a716-446655440010"

class JWTAuthenticationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.user_id = DUMMY_USER_ID
        response = await call_next(request)
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

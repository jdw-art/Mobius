from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

from app.config import settings
from app.utils.redis import get_redis


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    token = credentials.credentials
    redis_client = await get_redis()

    # Extract user_id from token (opaque token format: user_id:random_part)
    import base64
    try:
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        user_id = decoded.split(":")[0]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid",
        )

    # Check if this token matches the one stored for this user
    stored_token = await redis_client.get(f"auth:user:{user_id}")
    if stored_token != token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired or is invalid",
        )
    return user_id

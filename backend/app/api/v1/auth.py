import uuid
import base64
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.user import LoginRequest, TokenResponse, LogoutResponse
from app.schemas.user import UserCreate, UserResponse
from app.crud.user import verify_user, create_user, get_user_by_username
from app.utils.redis import get_redis
from app.config import settings

router = APIRouter()


def create_opaque_token(user_id: str) -> str:
    """Create an opaque token that contains user_id encoded inside it"""
    random_part = str(uuid.uuid4())
    token_data = f"{user_id}:{random_part}"
    return base64.urlsafe_b64encode(token_data.encode()).decode()


def extract_user_id_from_token(token: str) -> str | None:
    """Extract user_id from token"""
    try:
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        user_id = decoded.split(":")[0]
        return user_id
    except Exception:
        return None


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    user = await verify_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    redis_client = await get_redis()

    # Create new token with user_id encoded inside
    token = create_opaque_token(user.id)

    # Single key per user: auth:user:{user_id} -> token
    # This replaces any existing token automatically (single token per user)
    await redis_client.setex(
        f"auth:user:{user.id}",
        settings.redis_token_ttl,
        token,
    )
    return TokenResponse(access_token=token)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    existing = await get_user_by_username(db, user_data.username)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    user = await create_user(db, user_data)
    return user


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
):
    token = credentials.credentials
    redis_client = await get_redis()

    # Extract user_id from token
    user_id = extract_user_id_from_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    # Delete user's token
    deleted = await redis_client.delete(f"auth:user:{user_id}")
    if deleted == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return LogoutResponse(message="Logged out successfully")


@router.get("/verify")
async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
):
    """Verify if the current token is valid"""
    token = credentials.credentials
    redis_client = await get_redis()

    # Extract user_id from token
    user_id = extract_user_id_from_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalid or expired",
        )

    # Check if this token matches the one stored for this user
    stored_token = await redis_client.get(f"auth:user:{user_id}")
    if stored_token != token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalid or expired",
        )

    return {"user_id": user_id, "token": token}

from datetime import datetime

from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    username: str
    create_time: datetime

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    username: str
    password: str


class LogoutResponse(BaseModel):
    message: str

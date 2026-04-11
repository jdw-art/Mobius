from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ActivityBase(BaseModel):
    type: str
    time: datetime
    user: str
    action: str


class ActivityCreate(ActivityBase):
    project_id: str


class ActivityUpdate(BaseModel):
    type: Optional[str] = None
    time: Optional[datetime] = None
    user: Optional[str] = None
    action: Optional[str] = None


class ActivityResponse(ActivityBase):
    id: str
    project_id: str

    model_config = {"from_attributes": True}

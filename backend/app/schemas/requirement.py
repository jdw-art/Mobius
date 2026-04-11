from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RequirementBase(BaseModel):
    name: str
    version: str
    application: str
    module: str
    level: str
    creator: str


class RequirementCreate(RequirementBase):
    project_id: str


class RequirementUpdate(BaseModel):
    name: Optional[str] = None
    version: Optional[str] = None
    application: Optional[str] = None
    module: Optional[str] = None
    level: Optional[str] = None


class RequirementResponse(RequirementBase):
    id: str
    project_id: str
    create_time: datetime

    model_config = {"from_attributes": True}

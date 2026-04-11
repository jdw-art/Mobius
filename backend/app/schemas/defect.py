from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class DefectBase(BaseModel):
    name: str
    environment: str
    developer: str
    tester: str
    status: str
    creator: str
    application: str = ""


class DefectCreate(DefectBase):
    project_id: str
    application_id: str = ""


class DefectUpdate(BaseModel):
    name: Optional[str] = None
    environment: Optional[str] = None
    developer: Optional[str] = None
    tester: Optional[str] = None
    status: Optional[str] = None
    application_id: Optional[str] = None


class DefectResponse(DefectBase):
    id: str
    project_id: str
    application_id: str = ""
    create_time: datetime

    model_config = {"from_attributes": True}

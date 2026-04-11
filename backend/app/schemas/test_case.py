from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TestCaseBase(BaseModel):
    name: str
    status: str
    creator: str
    application: str = ""


class TestCaseCreate(TestCaseBase):
    project_id: str
    application_id: str = ""


class TestCaseUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    application_id: Optional[str] = None


class TestCaseResponse(TestCaseBase):
    id: str
    project_id: str
    application_id: str = ""
    create_time: datetime

    model_config = {"from_attributes": True}

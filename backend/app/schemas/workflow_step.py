from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class WorkflowStepBase(BaseModel):
    step: int
    name: str
    status: str
    time: Optional[datetime] = None


class WorkflowStepCreate(WorkflowStepBase):
    project_id: str


class WorkflowStepUpdate(BaseModel):
    step: Optional[int] = None
    name: Optional[str] = None
    status: Optional[str] = None
    time: Optional[datetime] = None


class WorkflowStepResponse(WorkflowStepBase):
    id: str
    project_id: str

    model_config = {"from_attributes": True}

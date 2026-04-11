from datetime import datetime, date
from typing import Optional, List

from pydantic import BaseModel


class TeamMemberBase(BaseModel):
    role: str
    name: str
    avatar: str
    emp_id: str


class TeamMemberResponse(TeamMemberBase):
    id: str

    model_config = {"from_attributes": True}


class WorkflowStepBase(BaseModel):
    step: int
    name: str
    status: str
    time: Optional[datetime] = None


class WorkflowStepResponse(WorkflowStepBase):
    id: str

    model_config = {"from_attributes": True}


class ActivityBase(BaseModel):
    type: str
    time: datetime
    user: str
    action: str


class ActivityResponse(ActivityBase):
    id: str

    model_config = {"from_attributes": True}


class DefectCount(BaseModel):
    resolved: int
    total: int


class TestCaseCount(BaseModel):
    executed: int
    total: int


class TaskCount(BaseModel):
    completed: int
    total: int


class ProjectBase(BaseModel):
    name: str
    type: str
    pm: str
    planned_design_time: Optional[date] = None
    planned_test_submit_time: Optional[date] = None
    planned_test_complete_time: Optional[date] = None
    planned_release_time: Optional[date] = None
    planned_delivery: Optional[date] = None
    planned_duration: Optional[str] = None
    budget: Optional[str] = None
    change_type: Optional[str] = None
    related_product: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    pm: Optional[str] = None
    progress: Optional[str] = None
    planned_design_time: Optional[date] = None
    planned_test_submit_time: Optional[date] = None
    planned_test_complete_time: Optional[date] = None
    planned_release_time: Optional[date] = None
    planned_delivery: Optional[date] = None
    planned_duration: Optional[str] = None
    budget: Optional[str] = None
    change_type: Optional[str] = None
    related_product: Optional[str] = None
    app_count: Optional[int] = None
    project_duration: Optional[int] = None


class ProjectListItem(BaseModel):
    id: str
    name: str
    type: str
    pm: str
    progress: str
    planned_delivery: Optional[date] = None
    status: str

    model_config = {"from_attributes": True}


class ProjectDetailResponse(ProjectBase):
    id: str
    status: str
    progress: str
    create_time: datetime
    app_count: int
    project_duration: int
    task_count: TaskCount
    defect_count: DefectCount
    test_case_count: TestCaseCount
    team_members: List[TeamMemberResponse] = []
    workflow_steps: List[WorkflowStepResponse] = []
    activities: List[ActivityResponse] = []

    model_config = {"from_attributes": True}


class ProjectResponse(BaseModel):
    id: str
    name: str
    type: str
    status: str
    pm: str
    progress: str
    create_time: datetime
    planned_design_time: Optional[date] = None
    planned_test_submit_time: Optional[date] = None
    planned_test_complete_time: Optional[date] = None
    planned_release_time: Optional[date] = None
    planned_delivery: Optional[date] = None
    planned_duration: Optional[str] = None
    budget: Optional[str] = None
    change_type: Optional[str] = None
    related_product: Optional[str] = None
    app_count: int
    project_duration: int

    model_config = {"from_attributes": True}

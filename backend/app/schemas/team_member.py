from typing import Optional

from pydantic import BaseModel


class TeamMemberBase(BaseModel):
    role: str
    name: str
    avatar: str
    emp_id: str


class TeamMemberCreate(TeamMemberBase):
    project_id: str


class TeamMemberUpdate(BaseModel):
    role: Optional[str] = None
    name: Optional[str] = None
    avatar: Optional[str] = None
    emp_id: Optional[str] = None


class TeamMemberResponse(TeamMemberBase):
    id: str
    project_id: str

    model_config = {"from_attributes": True}

from typing import Optional

from pydantic import BaseModel


class BuildBase(BaseModel):
    branch: str
    tester: str
    coverage: int = 0
    can_update_coverage: bool = True
    build_status: str = "未构建"
    deploy_status: str = "未部署"


class BuildCreate(BuildBase):
    project_id: str


class BuildUpdate(BaseModel):
    branch: Optional[str] = None
    tester: Optional[str] = None
    coverage: Optional[int] = None
    can_update_coverage: Optional[bool] = None
    build_status: Optional[str] = None
    deploy_status: Optional[str] = None


class BuildResponse(BuildBase):
    id: str
    project_id: str

    model_config = {"from_attributes": True}

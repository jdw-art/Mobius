from typing import Optional

from pydantic import BaseModel


class ApplicationBase(BaseModel):
    name: str
    branch: str
    version: str
    test_status: str
    deploy_method: str
    unit_test: str
    code_scan: str
    code_review: str
    status: str


class ApplicationCreate(ApplicationBase):
    project_id: str


class ApplicationUpdate(BaseModel):
    name: Optional[str] = None
    branch: Optional[str] = None
    version: Optional[str] = None
    test_status: Optional[str] = None
    deploy_method: Optional[str] = None
    unit_test: Optional[str] = None
    code_scan: Optional[str] = None
    code_review: Optional[str] = None
    status: Optional[str] = None


class ApplicationResponse(ApplicationBase):
    id: str
    project_id: str

    model_config = {"from_attributes": True}

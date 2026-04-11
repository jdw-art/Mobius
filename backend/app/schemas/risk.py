from typing import Optional

from pydantic import BaseModel


class RiskBase(BaseModel):
    risk_type: str
    risk_item: str
    risk_status: str = ""
    remark: str = ""


class RiskCreate(RiskBase):
    project_id: str


class RiskUpdate(BaseModel):
    risk_type: Optional[str] = None
    risk_item: Optional[str] = None
    risk_status: Optional[str] = None
    remark: Optional[str] = None


class RiskResponse(RiskBase):
    id: str
    project_id: str

    model_config = {"from_attributes": True}

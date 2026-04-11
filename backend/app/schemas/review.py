from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class ReviewProcessBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"
    reviewers: Optional[List[str]] = None
    review_time: Optional[datetime] = None
    comment: Optional[str] = None
    comment_editable: bool = True


class ReviewProcessCreate(ReviewProcessBase):
    review_id: str


class ReviewProcessUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    reviewers: Optional[List[str]] = None
    review_time: Optional[datetime] = None
    comment: Optional[str] = None
    comment_editable: Optional[bool] = None


class ReviewProcessResponse(ReviewProcessBase):
    id: str
    review_id: str

    model_config = {"from_attributes": True}


class ReviewBase(BaseModel):
    type: str
    title: str
    creator: str
    planned_complete_time: Optional[datetime] = None
    code_branch: Optional[str] = None
    pre_release_time: Optional[datetime] = None
    prod_release_time: Optional[datetime] = None


class ReviewCreate(ReviewBase):
    project_id: str
    requirement_id: Optional[str] = None


class ReviewUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    planned_complete_time: Optional[datetime] = None
    code_branch: Optional[str] = None
    pre_release_time: Optional[datetime] = None
    prod_release_time: Optional[datetime] = None


class ReviewResponse(ReviewBase):
    id: str
    project_id: str
    requirement_id: Optional[str] = None
    create_time: datetime
    processes: List[ReviewProcessResponse] = []

    model_config = {"from_attributes": True}

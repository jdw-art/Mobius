from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class DocumentBase(BaseModel):
    type: str
    name: str
    link: str
    creator: str


class DocumentCreate(DocumentBase):
    project_id: str


class DocumentUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    link: Optional[str] = None


class DocumentResponse(DocumentBase):
    id: str
    project_id: str
    create_time: datetime

    model_config = {"from_attributes": True}

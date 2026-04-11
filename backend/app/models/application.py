from __future__ import annotations

from typing import List, TYPE_CHECKING

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.defect import Defect
    from app.models.test_case import TestCase


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    branch: Mapped[str] = mapped_column(String(100), nullable=False)
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    test_status: Mapped[str] = mapped_column(String(20), nullable=False)
    deploy_method: Mapped[str] = mapped_column(String(50), nullable=False)
    unit_test: Mapped[str] = mapped_column(String(20), nullable=False)
    code_scan: Mapped[str] = mapped_column(String(20), nullable=False)
    code_review: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)

    project: Mapped[Project] = relationship(back_populates="applications")
    defects: Mapped[List[Defect]] = relationship(back_populates="application")
    test_cases: Mapped[List[TestCase]] = relationship(back_populates="application")

from __future__ import annotations

from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING

from sqlalchemy import String, Integer, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.requirement import Requirement
    from app.models.application import Application
    from app.models.defect import Defect
    from app.models.document import Document
    from app.models.review import Review
    from app.models.test_case import TestCase
    from app.models.risk import Risk
    from app.models.build import Build
    from app.models.activity import Activity
    from app.models.team_member import TeamMember
    from app.models.workflow_step import WorkflowStep


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    pm: Mapped[str] = mapped_column(String(50), nullable=False)
    progress: Mapped[str] = mapped_column(String(50), nullable=False)
    create_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    planned_design_time: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    planned_test_submit_time: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    planned_test_complete_time: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    planned_release_time: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    planned_delivery: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    planned_duration: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    budget: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    change_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    related_product: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    app_count: Mapped[int] = mapped_column(Integer, default=0)
    project_duration: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    requirements: Mapped[List[Requirement]] = relationship(back_populates="project", cascade="all, delete-orphan")
    applications: Mapped[List[Application]] = relationship(back_populates="project", cascade="all, delete-orphan")
    defects: Mapped[List[Defect]] = relationship(back_populates="project", cascade="all, delete-orphan")
    documents: Mapped[List[Document]] = relationship(back_populates="project", cascade="all, delete-orphan")
    reviews: Mapped[List[Review]] = relationship(back_populates="project", cascade="all, delete-orphan")
    test_cases: Mapped[List[TestCase]] = relationship(back_populates="project", cascade="all, delete-orphan")
    risks: Mapped[List[Risk]] = relationship(back_populates="project", cascade="all, delete-orphan")
    builds: Mapped[List[Build]] = relationship(back_populates="project", cascade="all, delete-orphan")
    activities: Mapped[List[Activity]] = relationship(back_populates="project", cascade="all, delete-orphan")
    team_members: Mapped[List[TeamMember]] = relationship(back_populates="project", cascade="all, delete-orphan")
    workflow_steps: Mapped[List[WorkflowStep]] = relationship(back_populates="project", cascade="all, delete-orphan")

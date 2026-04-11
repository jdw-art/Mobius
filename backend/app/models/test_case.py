from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.application import Application


class TestCase(Base):
    __tablename__ = "test_cases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id"), nullable=False)
    application_id: Mapped[str] = mapped_column(String(36), ForeignKey("applications.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    creator: Mapped[str] = mapped_column(String(50), nullable=False)
    create_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    status: Mapped[str] = mapped_column(String(20), nullable=False)

    project: Mapped[Project] = relationship(back_populates="test_cases")
    application: Mapped[Application] = relationship(back_populates="test_cases")

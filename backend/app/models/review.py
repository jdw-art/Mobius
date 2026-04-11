from datetime import datetime
from typing import Optional, List

from sqlalchemy import String, ForeignKey, DateTime, Text, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # design/code/test-case/release
    requirement_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("requirements.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    creator: Mapped[str] = mapped_column(String(50), nullable=False)
    create_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    planned_complete_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    code_branch: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    pre_release_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    prod_release_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    project: Mapped["Project"] = relationship(back_populates="reviews")
    processes: Mapped[List["ReviewProcess"]] = relationship(back_populates="review", cascade="all, delete-orphan")


class ReviewProcess(Base):
    __tablename__ = "review_processes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    review_id: Mapped[str] = mapped_column(String(36), ForeignKey("reviews.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # pending/approved/rejected
    reviewers: Mapped[Optional[List]] = mapped_column(JSON, nullable=True)  # JSON array of reviewer names
    review_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    comment_editable: Mapped[bool] = mapped_column(Boolean, default=True)

    review: Mapped["Review"] = relationship(back_populates="processes")

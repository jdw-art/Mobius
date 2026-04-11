from datetime import datetime

from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    user: Mapped[str] = mapped_column(String(50), nullable=False)
    action: Mapped[str] = mapped_column(String(500), nullable=False)

    project: Mapped["Project"] = relationship(back_populates="activities")

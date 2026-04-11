from typing import Optional

from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Risk(Base):
    __tablename__ = "risks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id"), nullable=False)
    risk_type: Mapped[str] = mapped_column(String(100), nullable=False)
    risk_item: Mapped[str] = mapped_column(String(500), nullable=False)
    risk_status: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # yes/no
    remark: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    project: Mapped["Project"] = relationship(back_populates="risks")

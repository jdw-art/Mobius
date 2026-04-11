from datetime import datetime

from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Defect(Base):
    __tablename__ = "defects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id"), nullable=False)
    application_id: Mapped[str] = mapped_column(String(36), ForeignKey("applications.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    environment: Mapped[str] = mapped_column(String(50), nullable=False)  # 测试环境/UAT环境
    developer: Mapped[str] = mapped_column(String(50), nullable=False)
    tester: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # 打开/修复中/关闭
    creator: Mapped[str] = mapped_column(String(50), nullable=False)
    create_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    project: Mapped["Project"] = relationship(back_populates="defects")
    application: Mapped["Application"] = relationship(back_populates="defects")

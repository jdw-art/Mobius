from sqlalchemy import String, ForeignKey, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Build(Base):
    __tablename__ = "builds"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id"), nullable=False)
    branch: Mapped[str] = mapped_column(String(100), nullable=False)
    tester: Mapped[str] = mapped_column(String(50), nullable=False)
    coverage: Mapped[int] = mapped_column(Integer, default=0)
    can_update_coverage: Mapped[bool] = mapped_column(Boolean, default=True)
    build_status: Mapped[str] = mapped_column(String(50), nullable=False)  # 未构建/构建中/构建成功/构建失败
    deploy_status: Mapped[str] = mapped_column(String(50), nullable=False)  # 未部署/部署中/部署成功/部署失败

    project: Mapped["Project"] = relationship(back_populates="builds")

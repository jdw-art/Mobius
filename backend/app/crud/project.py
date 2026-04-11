import uuid
from datetime import datetime, date
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.models.team_member import TeamMember
from app.models.workflow_step import WorkflowStep
from app.models.activity import Activity
from app.schemas.project import ProjectCreate, ProjectUpdate


async def get_project(db: AsyncSession, project_id: str) -> Optional[Project]:
    result = await db.execute(
        select(Project)
        .options(
            selectinload(Project.team_members),
            selectinload(Project.workflow_steps),
            selectinload(Project.activities),
        )
        .where(Project.id == project_id)
    )
    return result.scalar_one_or_none()


async def get_projects(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 10,
) -> tuple[List[Project], int]:
    # Get total count
    count_result = await db.execute(select(func.count()).select_from(Project))
    total = count_result.scalar() or 0

    # Get paginated items
    offset = (page - 1) * page_size
    result = await db.execute(
        select(Project).offset(offset).limit(page_size)
    )
    items = result.scalars().all()

    return items, total


async def create_project(db: AsyncSession, project_data: ProjectCreate) -> Project:
    project = Project(
        id=str(uuid.uuid4()),
        name=project_data.name,
        type=project_data.type,
        pm=project_data.pm,
        status="进行中",
        progress="设计",
        create_time=datetime.utcnow(),
        planned_design_time=project_data.planned_design_time,
        planned_test_submit_time=project_data.planned_test_submit_time,
        planned_test_complete_time=project_data.planned_test_complete_time,
        planned_release_time=project_data.planned_release_time,
        planned_delivery=project_data.planned_delivery,
        planned_duration=project_data.planned_duration,
        budget=project_data.budget,
        change_type=project_data.change_type,
        related_product=project_data.related_product,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


async def update_project(
    db: AsyncSession,
    project_id: str,
    project_data: ProjectUpdate,
) -> Optional[Project]:
    project = await get_project(db, project_id)
    if not project:
        return None

    update_data = project_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)
    return project


async def delete_project(db: AsyncSession, project_id: str) -> bool:
    project = await get_project(db, project_id)
    if not project:
        return False
    await db.delete(project)
    await db.commit()
    return True


# Need func for count
from sqlalchemy import func

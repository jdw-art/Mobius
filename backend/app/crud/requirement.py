import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.requirement import Requirement
from app.schemas.requirement import RequirementCreate, RequirementUpdate


async def get_requirement(db: AsyncSession, requirement_id: str) -> Optional[Requirement]:
    result = await db.execute(select(Requirement).where(Requirement.id == requirement_id))
    return result.scalar_one_or_none()


async def get_requirements_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[Requirement]:
    result = await db.execute(
        select(Requirement).where(Requirement.project_id == project_id)
    )
    return list(result.scalars().all())


async def create_requirement(db: AsyncSession, data: RequirementCreate) -> Requirement:
    requirement = Requirement(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        name=data.name,
        version=data.version,
        application=data.application,
        module=data.module,
        level=data.level,
        creator=data.creator,
        create_time=datetime.utcnow(),
    )
    db.add(requirement)
    await db.commit()
    await db.refresh(requirement)
    return requirement


async def update_requirement(
    db: AsyncSession,
    requirement_id: str,
    data: RequirementUpdate,
) -> Optional[Requirement]:
    requirement = await get_requirement(db, requirement_id)
    if not requirement:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(requirement, field, value)
    await db.commit()
    await db.refresh(requirement)
    return requirement


async def delete_requirement(db: AsyncSession, requirement_id: str) -> bool:
    requirement = await get_requirement(db, requirement_id)
    if not requirement:
        return False
    await db.delete(requirement)
    await db.commit()
    return True

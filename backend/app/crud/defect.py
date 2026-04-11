import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.defect import Defect
from app.schemas.defect import DefectCreate, DefectUpdate


async def get_defect(db: AsyncSession, defect_id: str) -> Optional[Defect]:
    result = await db.execute(select(Defect).where(Defect.id == defect_id))
    return result.scalar_one_or_none()


async def get_defects_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[Defect]:
    result = await db.execute(
        select(Defect).where(Defect.project_id == project_id)
    )
    return list(result.scalars().all())


async def create_defect(db: AsyncSession, data: DefectCreate) -> Defect:
    defect = Defect(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        application_id=data.application_id or "",
        name=data.name,
        environment=data.environment,
        developer=data.developer,
        tester=data.tester,
        status=data.status,
        creator=data.creator,
        create_time=datetime.utcnow(),
    )
    db.add(defect)
    await db.commit()
    await db.refresh(defect)
    return defect


async def update_defect(
    db: AsyncSession,
    defect_id: str,
    data: DefectUpdate,
) -> Optional[Defect]:
    defect = await get_defect(db, defect_id)
    if not defect:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(defect, field, value)
    await db.commit()
    await db.refresh(defect)
    return defect


async def delete_defect(db: AsyncSession, defect_id: str) -> bool:
    defect = await get_defect(db, defect_id)
    if not defect:
        return False
    await db.delete(defect)
    await db.commit()
    return True

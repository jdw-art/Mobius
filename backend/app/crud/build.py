import uuid
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.build import Build
from app.schemas.build import BuildCreate, BuildUpdate


async def get_build(db: AsyncSession, build_id: str) -> Optional[Build]:
    result = await db.execute(select(Build).where(Build.id == build_id))
    return result.scalar_one_or_none()


async def get_builds_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[Build]:
    result = await db.execute(
        select(Build).where(Build.project_id == project_id)
    )
    return list(result.scalars().all())


async def create_build(db: AsyncSession, data: BuildCreate) -> Build:
    build = Build(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        branch=data.branch,
        tester=data.tester,
        coverage=data.coverage,
        can_update_coverage=data.can_update_coverage,
        build_status=data.build_status,
        deploy_status=data.deploy_status,
    )
    db.add(build)
    await db.commit()
    await db.refresh(build)
    return build


async def update_build(
    db: AsyncSession,
    build_id: str,
    data: BuildUpdate,
) -> Optional[Build]:
    build = await get_build(db, build_id)
    if not build:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(build, field, value)
    await db.commit()
    await db.refresh(build)
    return build


async def delete_build(db: AsyncSession, build_id: str) -> bool:
    build = await get_build(db, build_id)
    if not build:
        return False
    await db.delete(build)
    await db.commit()
    return True

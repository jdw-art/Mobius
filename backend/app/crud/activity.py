import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityUpdate


async def get_activity(db: AsyncSession, activity_id: str) -> Optional[Activity]:
    result = await db.execute(select(Activity).where(Activity.id == activity_id))
    return result.scalar_one_or_none()


async def get_activities_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[Activity]:
    result = await db.execute(
        select(Activity).where(Activity.project_id == project_id).order_by(Activity.time.desc())
    )
    return list(result.scalars().all())


async def create_activity(db: AsyncSession, data: ActivityCreate) -> Activity:
    activity = Activity(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        type=data.type,
        time=data.time,
        user=data.user,
        action=data.action,
    )
    db.add(activity)
    await db.commit()
    await db.refresh(activity)
    return activity


async def update_activity(
    db: AsyncSession,
    activity_id: str,
    data: ActivityUpdate,
) -> Optional[Activity]:
    activity = await get_activity(db, activity_id)
    if not activity:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(activity, field, value)
    await db.commit()
    await db.refresh(activity)
    return activity


async def delete_activity(db: AsyncSession, activity_id: str) -> bool:
    activity = await get_activity(db, activity_id)
    if not activity:
        return False
    await db.delete(activity)
    await db.commit()
    return True

import uuid
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.risk import Risk
from app.schemas.risk import RiskCreate, RiskUpdate


async def get_risk(db: AsyncSession, risk_id: str) -> Optional[Risk]:
    result = await db.execute(select(Risk).where(Risk.id == risk_id))
    return result.scalar_one_or_none()


async def get_risks_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[Risk]:
    result = await db.execute(
        select(Risk).where(Risk.project_id == project_id)
    )
    return list(result.scalars().all())


async def create_risk(db: AsyncSession, data: RiskCreate) -> Risk:
    risk = Risk(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        risk_type=data.risk_type,
        risk_item=data.risk_item,
        risk_status=data.risk_status,
        remark=data.remark,
    )
    db.add(risk)
    await db.commit()
    await db.refresh(risk)
    return risk


async def update_risk(
    db: AsyncSession,
    risk_id: str,
    data: RiskUpdate,
) -> Optional[Risk]:
    risk = await get_risk(db, risk_id)
    if not risk:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(risk, field, value)
    await db.commit()
    await db.refresh(risk)
    return risk


async def delete_risk(db: AsyncSession, risk_id: str) -> bool:
    risk = await get_risk(db, risk_id)
    if not risk:
        return False
    await db.delete(risk)
    await db.commit()
    return True

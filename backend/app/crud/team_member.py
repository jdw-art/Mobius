import uuid
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.team_member import TeamMember
from app.schemas.team_member import TeamMemberCreate, TeamMemberUpdate


async def get_team_member(db: AsyncSession, team_member_id: str) -> Optional[TeamMember]:
    result = await db.execute(select(TeamMember).where(TeamMember.id == team_member_id))
    return result.scalar_one_or_none()


async def get_team_members_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[TeamMember]:
    result = await db.execute(
        select(TeamMember).where(TeamMember.project_id == project_id)
    )
    return list(result.scalars().all())


async def create_team_member(db: AsyncSession, data: TeamMemberCreate) -> TeamMember:
    team_member = TeamMember(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        role=data.role,
        name=data.name,
        avatar=data.avatar,
        emp_id=data.emp_id,
    )
    db.add(team_member)
    await db.commit()
    await db.refresh(team_member)
    return team_member


async def update_team_member(
    db: AsyncSession,
    team_member_id: str,
    data: TeamMemberUpdate,
) -> Optional[TeamMember]:
    team_member = await get_team_member(db, team_member_id)
    if not team_member:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(team_member, field, value)
    await db.commit()
    await db.refresh(team_member)
    return team_member


async def delete_team_member(db: AsyncSession, team_member_id: str) -> bool:
    team_member = await get_team_member(db, team_member_id)
    if not team_member:
        return False
    await db.delete(team_member)
    await db.commit()
    return True

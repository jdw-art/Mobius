from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListItem, ProjectDetailResponse,
    TaskCount, DefectCount, TestCaseCount,
)
from app.schemas.requirement import RequirementCreate, RequirementUpdate, RequirementResponse
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse
from app.schemas.defect import DefectCreate, DefectUpdate, DefectResponse
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentResponse
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewResponse
from app.schemas.test_case import TestCaseCreate, TestCaseUpdate, TestCaseResponse
from app.schemas.risk import RiskCreate, RiskUpdate, RiskResponse
from app.schemas.build import BuildCreate, BuildUpdate, BuildResponse
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse
from app.schemas.team_member import TeamMemberCreate, TeamMemberUpdate, TeamMemberResponse
from app.schemas.workflow_step import WorkflowStepCreate, WorkflowStepUpdate, WorkflowStepResponse
from app.crud import project as project_crud
from app.crud import requirement as requirement_crud
from app.crud import application as application_crud
from app.crud import defect as defect_crud
from app.crud import document as document_crud
from app.crud import review as review_crud
from app.crud import test_case as test_case_crud
from app.crud import risk as risk_crud
from app.crud import build as build_crud
from app.crud import activity as activity_crud
from app.crud import team_member as team_member_crud
from app.crud import workflow_step as workflow_step_crud

router = APIRouter()


# ============ Project CRUD ============

@router.get("", response_model=List[ProjectListItem])
async def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    items, total = await project_crud.get_projects(db, page, page_size)
    return items


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await project_crud.create_project(db, project_data)


@router.get("/{project_id}", response_model=ProjectDetailResponse)
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    project = await project_crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Calculate counts
    defect_count = DefectCount(resolved=0, total=len(project.defects))
    test_case_count = TestCaseCount(executed=0, total=0)
    task_count = TaskCount(completed=0, total=0)

    return ProjectDetailResponse(
        id=project.id,
        name=project.name,
        type=project.type,
        status=project.status,
        pm=project.pm,
        progress=project.progress,
        create_time=project.create_time,
        planned_design_time=project.planned_design_time,
        planned_test_submit_time=project.planned_test_submit_time,
        planned_test_complete_time=project.planned_test_complete_time,
        planned_release_time=project.planned_release_time,
        planned_delivery=project.planned_delivery,
        planned_duration=project.planned_duration,
        budget=project.budget,
        change_type=project.change_type,
        related_product=project.related_product,
        app_count=project.app_count,
        project_duration=project.project_duration,
        task_count=task_count,
        defect_count=defect_count,
        test_case_count=test_case_count,
        team_members=[TeamMemberResponse.model_validate(m) for m in project.team_members],
        workflow_steps=[WorkflowStepResponse.model_validate(w) for w in project.workflow_steps],
        activities=[ActivityResponse.model_validate(a) for a in project.activities],
    )


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    project = await project_crud.update_project(db, project_id, project_data)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await project_crud.delete_project(db, project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")


# ============ Requirements ============

@router.get("/{project_id}/requirements", response_model=List[RequirementResponse])
async def list_requirements(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await requirement_crud.get_requirements_by_project(db, project_id)


@router.post("/{project_id}/requirements", response_model=RequirementResponse, status_code=status.HTTP_201_CREATED)
async def create_requirement(
    project_id: str,
    data: RequirementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await requirement_crud.create_requirement(db, data)


@router.put("/{project_id}/requirements/{requirement_id}", response_model=RequirementResponse)
async def update_requirement(
    project_id: str,
    requirement_id: str,
    data: RequirementUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    requirement = await requirement_crud.update_requirement(db, requirement_id, data)
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")
    return requirement


@router.delete("/{project_id}/requirements/{requirement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_requirement(
    project_id: str,
    requirement_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await requirement_crud.delete_requirement(db, requirement_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Requirement not found")


# ============ Applications ============

@router.get("/{project_id}/applications", response_model=List[ApplicationResponse])
async def list_applications(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await application_crud.get_applications_by_project(db, project_id)


@router.post("/{project_id}/applications", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    project_id: str,
    data: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await application_crud.create_application(db, data)


@router.put("/{project_id}/applications/{application_id}", response_model=ApplicationResponse)
async def update_application(
    project_id: str,
    application_id: str,
    data: ApplicationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    application = await application_crud.update_application(db, application_id, data)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.delete("/{project_id}/applications/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(
    project_id: str,
    application_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await application_crud.delete_application(db, application_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Application not found")


# ============ Defects ============

@router.get("/{project_id}/defects", response_model=List[DefectResponse])
async def list_defects(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await defect_crud.get_defects_by_project(db, project_id)


@router.post("/{project_id}/defects", response_model=DefectResponse, status_code=status.HTTP_201_CREATED)
async def create_defect(
    project_id: str,
    data: DefectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await defect_crud.create_defect(db, data)


@router.put("/{project_id}/defects/{defect_id}", response_model=DefectResponse)
async def update_defect(
    project_id: str,
    defect_id: str,
    data: DefectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    defect = await defect_crud.update_defect(db, defect_id, data)
    if not defect:
        raise HTTPException(status_code=404, detail="Defect not found")
    return defect


@router.delete("/{project_id}/defects/{defect_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_defect(
    project_id: str,
    defect_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await defect_crud.delete_defect(db, defect_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Defect not found")


# ============ Documents ============

@router.get("/{project_id}/documents", response_model=List[DocumentResponse])
async def list_documents(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await document_crud.get_documents_by_project(db, project_id)


@router.post("/{project_id}/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    project_id: str,
    data: DocumentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await document_crud.create_document(db, data)


@router.put("/{project_id}/documents/{document_id}", response_model=DocumentResponse)
async def update_document(
    project_id: str,
    document_id: str,
    data: DocumentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    document = await document_crud.update_document(db, document_id, data)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.delete("/{project_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    project_id: str,
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await document_crud.delete_document(db, document_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")


# ============ Reviews ============

@router.get("/{project_id}/reviews", response_model=List[ReviewResponse])
async def list_reviews(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await review_crud.get_reviews_by_project(db, project_id)


@router.get("/{project_id}/reviews/{review_type}", response_model=List[ReviewResponse])
async def list_reviews_by_type(
    project_id: str,
    review_type: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await review_crud.get_reviews_by_project_and_type(db, project_id, review_type)


@router.post("/{project_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    project_id: str,
    data: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await review_crud.create_review(db, data)


@router.put("/{project_id}/reviews/{review_id}", response_model=ReviewResponse)
async def update_review(
    project_id: str,
    review_id: str,
    data: ReviewUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    review = await review_crud.update_review(db, review_id, data)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.delete("/{project_id}/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    project_id: str,
    review_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await review_crud.delete_review(db, review_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Review not found")


# ============ Test Cases ============

@router.get("/{project_id}/test-cases", response_model=List[TestCaseResponse])
async def list_test_cases(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await test_case_crud.get_test_cases_by_project(db, project_id)


@router.post("/{project_id}/test-cases", response_model=TestCaseResponse, status_code=status.HTTP_201_CREATED)
async def create_test_case(
    project_id: str,
    data: TestCaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await test_case_crud.create_test_case(db, data)


@router.put("/{project_id}/test-cases/{test_case_id}", response_model=TestCaseResponse)
async def update_test_case(
    project_id: str,
    test_case_id: str,
    data: TestCaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    test_case = await test_case_crud.update_test_case(db, test_case_id, data)
    if not test_case:
        raise HTTPException(status_code=404, detail="Test case not found")
    return test_case


@router.delete("/{project_id}/test-cases/{test_case_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_test_case(
    project_id: str,
    test_case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await test_case_crud.delete_test_case(db, test_case_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Test case not found")


# ============ Risks ============

@router.get("/{project_id}/risks", response_model=List[RiskResponse])
async def list_risks(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await risk_crud.get_risks_by_project(db, project_id)


@router.post("/{project_id}/risks", response_model=RiskResponse, status_code=status.HTTP_201_CREATED)
async def create_risk(
    project_id: str,
    data: RiskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await risk_crud.create_risk(db, data)


@router.put("/{project_id}/risks/{risk_id}", response_model=RiskResponse)
async def update_risk(
    project_id: str,
    risk_id: str,
    data: RiskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    risk = await risk_crud.update_risk(db, risk_id, data)
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    return risk


@router.delete("/{project_id}/risks/{risk_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_risk(
    project_id: str,
    risk_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await risk_crud.delete_risk(db, risk_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Risk not found")


# ============ Builds ============

@router.get("/{project_id}/builds", response_model=List[BuildResponse])
async def list_builds(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await build_crud.get_builds_by_project(db, project_id)


@router.post("/{project_id}/builds", response_model=BuildResponse, status_code=status.HTTP_201_CREATED)
async def create_build(
    project_id: str,
    data: BuildCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await build_crud.create_build(db, data)


@router.put("/{project_id}/builds/{build_id}", response_model=BuildResponse)
async def update_build(
    project_id: str,
    build_id: str,
    data: BuildUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    build = await build_crud.update_build(db, build_id, data)
    if not build:
        raise HTTPException(status_code=404, detail="Build not found")
    return build


@router.delete("/{project_id}/builds/{build_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_build(
    project_id: str,
    build_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await build_crud.delete_build(db, build_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Build not found")


# ============ Activities ============

@router.get("/{project_id}/activities", response_model=List[ActivityResponse])
async def list_activities(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await activity_crud.get_activities_by_project(db, project_id)


@router.post("/{project_id}/activities", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(
    project_id: str,
    data: ActivityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await activity_crud.create_activity(db, data)


@router.put("/{project_id}/activities/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    project_id: str,
    activity_id: str,
    data: ActivityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    activity = await activity_crud.update_activity(db, activity_id, data)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity


@router.delete("/{project_id}/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    project_id: str,
    activity_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await activity_crud.delete_activity(db, activity_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Activity not found")


# ============ Team Members ============

@router.get("/{project_id}/team", response_model=List[TeamMemberResponse])
async def list_team_members(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await team_member_crud.get_team_members_by_project(db, project_id)


@router.post("/{project_id}/team", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
async def create_team_member(
    project_id: str,
    data: TeamMemberCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await team_member_crud.create_team_member(db, data)


@router.put("/{project_id}/team/{team_member_id}", response_model=TeamMemberResponse)
async def update_team_member(
    project_id: str,
    team_member_id: str,
    data: TeamMemberUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    member = await team_member_crud.update_team_member(db, team_member_id, data)
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member


@router.delete("/{project_id}/team/{team_member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team_member(
    project_id: str,
    team_member_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await team_member_crud.delete_team_member(db, team_member_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Team member not found")


# ============ Workflow Steps ============

@router.get("/{project_id}/workflow", response_model=List[WorkflowStepResponse])
async def list_workflow_steps(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return await workflow_step_crud.get_workflow_steps_by_project(db, project_id)


@router.post("/{project_id}/workflow", response_model=WorkflowStepResponse, status_code=status.HTTP_201_CREATED)
async def create_workflow_step(
    project_id: str,
    data: WorkflowStepCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    data.project_id = project_id
    return await workflow_step_crud.create_workflow_step(db, data)


@router.put("/{project_id}/workflow/{workflow_step_id}", response_model=WorkflowStepResponse)
async def update_workflow_step(
    project_id: str,
    workflow_step_id: str,
    data: WorkflowStepUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    step = await workflow_step_crud.update_workflow_step(db, workflow_step_id, data)
    if not step:
        raise HTTPException(status_code=404, detail="Workflow step not found")
    return step


@router.delete("/{project_id}/workflow/{workflow_step_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow_step(
    project_id: str,
    workflow_step_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    deleted = await workflow_step_crud.delete_workflow_step(db, workflow_step_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Workflow step not found")

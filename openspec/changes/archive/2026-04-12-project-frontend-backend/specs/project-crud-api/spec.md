## ADDED Requirements

### Requirement: Project list API returns real data
The system SHALL return project list from MySQL database via `/api/v1/projects` endpoint.

#### Scenario: Authenticated user fetches project list
- **WHEN** authenticated user accesses project list page
- **THEN** system SHALL fetch projects from `/api/v1/projects`
- **AND** system SHALL return 401 if unauthenticated

### Requirement: Project detail API returns real data
The system SHALL return project detail from MySQL database via `/api/v1/projects/{id}`.

#### Scenario: Authenticated user fetches project detail
- **WHEN** authenticated user accesses project detail page
- **THEN** system SHALL return project with team_members, workflow_steps, activities, defects
- **AND** system SHALL return 404 if project not found
- **AND** system SHALL return 401 if unauthenticated

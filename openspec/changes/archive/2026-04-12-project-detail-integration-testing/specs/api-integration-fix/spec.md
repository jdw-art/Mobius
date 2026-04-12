## ADDED Requirements

### Requirement: Defects API returns data correctly
The system SHALL return defect list from database via `/api/v1/projects/{id}/defects` endpoint.

#### Scenario: User fetches defects for a project
- **WHEN** user navigates to project detail defects tab
- **THEN** system SHALL return defect list from database
- **AND** system SHALL return 401 if unauthenticated
- **AND** system SHALL return empty array if no defects exist

### Requirement: Risks API returns data correctly
The system SHALL return risk list from database via `/api/v1/projects/{id}/risks` endpoint.

#### Scenario: User fetches risks for a project
- **WHEN** user navigates to project detail risks tab
- **THEN** system SHALL return risk list from database
- **AND** system SHALL return 401 if unauthenticated
- **AND** system SHALL return empty array if no risks exist

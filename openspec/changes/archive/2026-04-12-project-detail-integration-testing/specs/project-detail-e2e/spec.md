## ADDED Requirements

### Requirement: Playwright MCP is configured and working
The system SHALL have Playwright MCP configured for browser automation testing.

#### Scenario: Verify Playwright MCP is available
- **WHEN** testing is performed
- **THEN** Playwright MCP SHOULD be available for browser automation

### Requirement: Project list page displays correctly
The system SHALL display project list from API.

#### Scenario: User views project list
- **WHEN** authenticated user navigates to project list
- **THEN** system SHALL display project list from `/api/v1/projects`
- **AND** user SHALL be able to click on a project to view details

### Requirement: Project detail tabs display correct data
The system SHALL display data for each tab from API.

#### Scenario: User views each project detail tab
- **WHEN** user navigates to project detail page
- **THEN** Overview tab SHALL display project overview data
- **AND** Requirements tab SHALL display requirements from API
- **AND** Applications tab SHALL display applications from API
- **AND** Builds tab SHALL display builds from API
- **AND** Defects tab SHALL display defects from API (or mock fallback)
- **AND** Documents tab SHALL display documents from API
- **AND** Risks tab SHALL display risks from API (or mock fallback)

### Requirement: Login flow works with Playwright
The system SHALL allow user to login and persist session.

#### Scenario: User logs in and navigates to protected route
- **WHEN** user enters valid credentials and clicks login
- **THEN** system SHALL store token in localStorage
- **AND** user SHALL be redirected to project list
- **AND** page refresh SHALL NOT logout user

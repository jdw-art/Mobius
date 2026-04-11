## ADDED Requirements

### Requirement: Project list page displays real API data

The frontend SHALL fetch project list from GET /api/v1/projects and display in the table.

#### Scenario: Project list page loads data from API
- **WHEN** user navigates to home page (project list)
- **THEN** frontend calls GET /api/v1/projects with Bearer token
- **AND** displays returned projects in the table
- **AND** shows loading state while fetching

#### Scenario: Project list page handles API error
- **WHEN** API call fails (network error or 401)
- **THEN** frontend shows error message
- **AND** redirects to /login if 401

### Requirement: Project detail page displays real API data

The frontend SHALL fetch project detail from GET /api/v1/projects/{id} and display in all tabs.

#### Scenario: Project detail page loads all tabs
- **WHEN** user navigates to /project/{id}
- **THEN** frontend fetches project detail from API
- **AND** displays data in Overview, Requirements, Applications, Defects, Documents, Risks, Builds, Reviews, Acceptance tabs

### Requirement: Requirements tab uses real API data

The frontend SHALL fetch requirements from GET /api/v1/projects/{id}/requirements.

#### Scenario: Requirements tab displays requirements
- **WHEN** user clicks "需求" tab
- **THEN** frontend calls GET /api/v1/projects/{id}/requirements
- **AND** displays returned requirements in the table

### Requirement: Applications tab uses real API data

The frontend SHALL fetch applications from GET /api/v1/projects/{id}/applications.

#### Scenario: Applications tab displays applications
- **WHEN** user clicks "应用" tab
- **THEN** frontend calls GET /api/v1/projects/{id}/applications
- **AND** displays returned applications in the table

### Requirement: Defects tab uses real API data

The frontend SHALL fetch defects from GET /api/v1/projects/{id}/defects.

#### Scenario: Defects tab displays defects
- **WHEN** user clicks "测试缺陷" tab
- **THEN** frontend calls GET /api/v1/projects/{id}/defects
- **AND** displays returned defects in the table

### Requirement: Documents tab uses real API data

The frontend SHALL fetch documents from GET /api/v1/projects/{id}/documents.

#### Scenario: Documents tab displays documents
- **WHEN** user clicks "文档" tab
- **THEN** frontend calls GET /api/v1/projects/{id}/documents
- **AND** displays returned documents in the table

### Requirement: Builds tab uses real API data

The frontend SHALL fetch builds from GET /api/v1/projects/{id}/builds.

#### Scenario: Builds tab displays builds
- **WHEN** user clicks "构建列表" tab
- **THEN** frontend calls GET /api/v1/projects/{id}/builds
- **AND** displays returned builds in the table

### Requirement: Reviews tab uses real API data

The frontend SHALL fetch reviews from GET /api/v1/projects/{id}/reviews.

#### Scenario: Reviews tab displays reviews
- **WHEN** user clicks "评审" tab
- **THEN** frontend calls GET /api/v1/projects/{id}/reviews
- **AND** displays returned reviews

### Requirement: API requests include Bearer token

All API calls from frontend SHALL include the Bearer token in Authorization header.

#### Scenario: Request includes authorization header
- **WHEN** any service makes an API request
- **THEN** axios interceptor adds "Authorization: Bearer {token}" header
- **AND** token is read from localStorage mobius_token key

### Requirement: 401 response redirects to login

When API returns 401, frontend SHALL redirect user to /login page.

#### Scenario: 401 redirects to login
- **WHEN** API call returns HTTP 401
- **THEN** frontend removes mobius_token from localStorage
- **AND** redirects to /login

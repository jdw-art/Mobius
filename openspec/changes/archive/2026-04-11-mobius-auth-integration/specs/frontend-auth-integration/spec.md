## ADDED Requirements

### Requirement: Login page allows user authentication

The frontend SHALL provide a login page where users can enter credentials to authenticate.

#### Scenario: Successful login redirects to home
- **WHEN** user enters valid username and password and clicks login button
- **THEN** system calls POST /api/v1/auth/login
- **AND** on success, system stores the returned access_token in localStorage under key "mobius_token"
- **AND** system redirects user to the home page (/)
- **AND** system displays the username in the navigation bar

#### Scenario: Failed login shows error message
- **WHEN** user enters invalid credentials and clicks login button
- **THEN** system calls POST /api/v1/auth/login
- **AND** on failure, system displays an error message "Invalid credentials"
- **AND** system does NOT store any token in localStorage

#### Scenario: Login page has link to register
- **WHEN** user is on the login page
- **THEN** system displays a link "Don't have an account? Register" that navigates to /register

### Requirement: Register page allows new user registration

The frontend SHALL provide a registration page where new users can create an account.

#### Scenario: Successful registration redirects to login
- **WHEN** user enters valid username (5-50 chars) and password (min 6 chars) and clicks register button
- **THEN** system calls POST /api/v1/auth/register
- **AND** on success, system displays a success message "Registration successful! Please login."
- **AND** system redirects user to the login page (/login) after 2 seconds

#### Scenario: Registration validation error shows message
- **WHEN** user enters an invalid username or password and clicks register button
- **THEN** system calls POST /api/v1/auth/register
- **AND** on validation error, system displays the specific validation error message

#### Scenario: Registration page has link to login
- **WHEN** user is on the register page
- **THEN** system displays a link "Already have an account? Login" that navigates to /login

### Requirement: AuthContext manages authentication state globally

The frontend SHALL provide an AuthContext that manages user authentication state across the application.

#### Scenario: Initial state - no token
- **WHEN** application loads and localStorage has no "mobius_token"
- **THEN** AuthContext provides { isAuthenticated: false, user: null }

#### Scenario: Restored state - valid token exists
- **WHEN** application loads and localStorage has a "mobius_token"
- **THEN** AuthContext provides { isAuthenticated: true, user: <username> }

#### Scenario: Login updates state
- **WHEN** user successfully logs in
- **THEN** AuthContext updates to { isAuthenticated: true, user: <username> }

#### Scenario: Logout clears state
- **WHEN** user clicks logout button
- **THEN** system removes "mobius_token" from localStorage
- **AND** AuthContext updates to { isAuthenticated: false, user: null }
- **AND** system redirects user to /login

### Requirement: ProtectedRoute guards authenticated pages

The frontend SHALL provide a ProtectedRoute component that redirects unauthenticated users to the login page.

#### Scenario: Authenticated user accesses protected route
- **WHEN** user with valid token accesses a route wrapped in ProtectedRoute
- **THEN** system renders the protected component

#### Scenario: Unauthenticated user redirected to login
- **WHEN** user without token accesses a route wrapped in ProtectedRoute
- **THEN** system redirects user to /login
- **AND** system stores the attempted URL so user can be redirected back after login

### Requirement: API requests include Bearer token

The frontend SHALL automatically include the Bearer token in all API requests.

#### Scenario: Request with valid token
- **WHEN** user is authenticated and makes an API request via axios
- **THEN** axios interceptors add header "Authorization: Bearer <token>" to the request

#### Scenario: Request without token (401 handling)
- **WHEN** user makes an API request and receives HTTP 401 response
- **THEN** system removes "mobius_token" from localStorage
- **AND** system redirects user to /login

### Requirement: All existing services use real API calls

The frontend SHALL改造 all existing service files to call the real backend API instead of returning mock data.

#### Scenario: ProjectListPage uses real API
- **WHEN** user navigates to the home page (project list)
- **THEN** system calls GET /api/v1/projects with Bearer token
- **AND** displays the returned project data

#### Scenario: All nested resource services use real API
- **WHEN** user accesses any resource (requirements, applications, defects, etc.)
- **THEN** system calls the corresponding nested API endpoint with Bearer token
- **AND** returns real data from the backend

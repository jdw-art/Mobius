## ADDED Requirements

### Requirement: User can register an account

The system SHALL allow users to register a new account with username and password.

#### Scenario: Successful registration
- **WHEN** user submits valid username (5-50 chars) and password (min 6 chars) via POST /api/v1/auth/register
- **THEN** system creates a new user with hashed password and returns user id and username
- **AND** system returns HTTP 201 with user data

#### Scenario: Username already exists
- **WHEN** user submits a username that already exists via POST /api/v1/auth/register
- **THEN** system returns HTTP 400 with error detail "Username already registered"

#### Scenario: Invalid username format
- **WHEN** user submits username shorter than 5 chars or longer than 50 chars via POST /api/v1/auth/register
- **THEN** system returns HTTP 422 with validation error

#### Scenario: Invalid password format
- **WHEN** user submits password shorter than 6 chars via POST /api/v1/auth/register
- **THEN** system returns HTTP 422 with validation error

### Requirement: User can login

The system SHALL allow users to login with valid username and password, returning a Redis-stored token.

#### Scenario: Successful login
- **WHEN** user submits valid credentials via POST /api/v1/auth/login
- **THEN** system verifies password against stored hash
- **AND** system generates a UUID token and stores it in Redis with key `auth:token:<uuid>` mapping to user_id
- **AND** system sets TTL to 43200 seconds (12 hours)
- **AND** system returns HTTP 200 with { "access_token": "<uuid>", "token_type": "bearer" }

#### Scenario: Invalid username
- **WHEN** user submits non-existent username via POST /api/v1/auth/login
- **THEN** system returns HTTP 401 with error detail "Invalid credentials"

#### Scenario: Invalid password
- **WHEN** user submits valid username but wrong password via POST /api/v1/auth/login
- **THEN** system returns HTTP 401 with error detail "Invalid credentials"

### Requirement: User can logout

The system SHALL allow authenticated users to logout, invalidating their Redis token.

#### Scenario: Successful logout
- **WHEN** authenticated user calls POST /api/v1/auth/logout with valid Bearer token
- **THEN** system deletes the token from Redis
- **AND** system returns HTTP 200 with message "Logged out successfully"

#### Scenario: Logout with invalid token
- **WHEN** user calls POST /api/v1/auth/logout with invalid or expired token
- **THEN** system returns HTTP 401 with error detail "Invalid token"

### Requirement: Authenticated endpoints validate token via Redis

The system SHALL validate Bearer tokens by checking Redis (not JWT decode) for all protected endpoints.

#### Scenario: Valid Redis token
- **WHEN** user makes a request with valid Bearer token that exists in Redis
- **THEN** system returns the requested data

#### Scenario: Token not in Redis (logged out or expired)
- **WHEN** user makes a request with Bearer token that is not in Redis
- **THEN** system returns HTTP 401 with error detail "Token has expired or is invalid"

#### Scenario: Missing Bearer token
- **WHEN** user makes a request without Authorization header to a protected endpoint
- **THEN** system returns HTTP 403 with error detail "Not authenticated"

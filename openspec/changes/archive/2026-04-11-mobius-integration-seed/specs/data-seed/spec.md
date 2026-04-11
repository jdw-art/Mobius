## ADDED Requirements

### Requirement: Seed script creates project data

The seed script SHALL create a demo project "用户管理系统重构" (PRJ001) with all related data.

#### Scenario: Seed creates project with requirements
- **WHEN** seed script runs
- **THEN** creates project PRJ001 with name "用户管理系统重构"
- **AND** creates 5 requirements (REQ001-REQ005) linked to PRJ001

#### Scenario: Seed creates project with applications
- **WHEN** seed script runs
- **THEN** creates 5 applications (APP001-APP005) linked to PRJ001
- **AND** each application has branch, version, testStatus, deployMethod fields

#### Scenario: Seed creates project with defects
- **WHEN** seed script runs
- **THEN** creates 8 defects (DEF001-DEF008) linked to PRJ001
- **AND** defects have various statuses (打开, 修复中, 关闭)

#### Scenario: Seed creates project with documents
- **WHEN** seed script runs
- **THEN** creates 2 documents (DOC001-DOC002) linked to PRJ001

#### Scenario: Seed creates project with team members
- **WHEN** seed script runs
- **THEN** creates 8 team members linked to PRJ001
- **AND** each member has role, name, avatar, emp_id

#### Scenario: Seed creates project with workflow steps
- **WHEN** seed script runs
- **THEN** creates 7 workflow steps linked to PRJ001
- **AND** steps have status: completed, current, or pending

#### Scenario: Seed creates project with activities
- **WHEN** seed script runs
- **THEN** creates 12 activity records linked to PRJ001

#### Scenario: Seed creates project with builds
- **WHEN** seed script runs
- **THEN** creates 5 build records linked to PRJ001

#### Scenario: Seed creates project with reviews
- **WHEN** seed script runs
- **THEN** creates review records linked to PRJ001

#### Scenario: Seed creates project with test cases
- **WHEN** seed script runs
- **THEN** creates test case records linked to PRJ001

#### Scenario: Seed creates project with risks
- **WHEN** seed script runs
- **THEN** creates risk records linked to PRJ001

### Requirement: Seed script is idempotent

The seed script SHALL be safe to run multiple times without creating duplicate data.

#### Scenario: Running seed twice does not duplicate data
- **WHEN** seed script runs twice
- **THEN** second run updates existing records instead of creating duplicates
- **OR** second run skips existing records (using INSERT OR IGNORE)

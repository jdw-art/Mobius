## 1. Database Seed Script

- [x] 1.1 Create `backend/scripts/seed.py` with SQLAlchemy ORM
- [x] 1.2 Create project PRJ001 with all fields
- [x] 1.3 Create requirements (5 records) linked to PRJ001
- [x] 1.4 Create applications (5 records) linked to PRJ001
- [x] 1.5 Create defects (8 records) linked to PRJ001
- [x] 1.6 Create documents (2 records) linked to PRJ001
- [x] 1.7 Create team_members (8 records) linked to PRJ001
- [x] 1.8 Create workflow_steps (7 records) linked to PRJ001
- [x] 1.9 Create activities (12 records) linked to PRJ001
- [x] 1.10 Create builds (5 records) linked to PRJ001
- [x] 1.11 Create reviews linked to PRJ001
- [x] 1.12 Create test_cases linked to PRJ001
- [x] 1.13 Create risks linked to PRJ001
- [x] 1.14 Run seed script and verify data in database

## 2. Frontend Service Integration

- [x] 2.1 Verify projectService.ts API calls work (project list/detail)
- [x] 2.2 Update ProjectDetail.tsx to use real API for project detail
- [x] 2.3 Update RequirementsTab to use requirementsService.getByProject
- [x] 2.4 Update ApplicationsTab to use applicationsService.getByProject
- [x] 2.5 Update DefectsTab to use defectsService.getByProject
- [x] 2.6 Update DocumentsTab to use documentsService.getByProject
- [x] 2.7 Update BuildsTab to use buildsService.getByProject
- [x] 2.8 Update ReviewsTab to use reviews API
- [x] 2.9 Update OverviewTab to display real project data

## 3. Integration Testing

- [ ] 3.1 Test login flow: register user → login → verify token in Redis
- [ ] 3.2 Test project list: verify projects display from API
- [ ] 3.3 Test project detail: click project → verify detail page loads
- [ ] 3.4 Test all tabs: verify Requirements/Applications/Defects/Documents/Builds/Reviews data displays
- [ ] 3.5 Test logout: verify token cleared and redirect to /login

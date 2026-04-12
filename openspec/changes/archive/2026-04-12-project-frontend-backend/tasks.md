## 1. Backend API Verification

- [x] 1.1 Restart backend server to apply dependencies.py fix (backend already running)
- [x] 1.2 Test login API returns valid token
- [x] 1.3 Test /api/v1/auth/verify endpoint
- [x] 1.4 Test /api/v1/projects returns project list
- [x] 1.5 Test /api/v1/projects/{id} returns project detail with related data

## 2. Frontend Service Integration

- [x] 2.1 Verify projectService.getProjects uses real API
- [x] 2.2 Verify projectService.getProject uses real API
- [x] 2.3 Verify requirementsService.getByProject uses real API
- [x] 2.4 Verify applicationsService.getByProject uses real API
- [x] 2.5 Verify defectsService.getByProject uses real API
- [x] 2.6 Verify documentsService.getByProject uses real API
- [x] 2.7 Verify buildsService.getByProject uses real API

## 3. Project Detail Tab Testing

- [ ] 3.1 Test Overview tab displays project data
- [ ] 3.2 Test Requirements tab fetches and displays requirements
- [ ] 3.3 Test Applications tab fetches and displays applications
- [ ] 3.4 Test Builds tab fetches and displays builds
- [ ] 3.5 Test Defects tab fetches and displays defects
- [ ] 3.6 Test Documents tab fetches and displays documents
- [ ] 3.7 Test Risks tab fetches and displays risks

## 4. Mock Data Cleanup (Optional)

- [ ] 4.1 Remove fallback mock data from service files
- [ ] 4.2 Remove MOCK_* constants from service files

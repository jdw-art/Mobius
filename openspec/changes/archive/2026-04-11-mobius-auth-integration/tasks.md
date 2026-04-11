## 1. Backend - Redis & Dependencies

- [x] 1.1 Add `redis>=5.0.0` to `backend/requirements.txt`
- [x] 1.2 Add Redis config to `backend/.env` (REDIS_URL=redis://:jdw112233@127.0.0.1:6379/0)
- [x] 1.3 Create `backend/app/utils/__init__.py` and `backend/app/utils/redis.py` with Redis client singleton

## 2. Backend - User Model & Schema

- [x] 2.1 User model already exists in Phase 1
- [x] 2.2 User schemas already exist in Phase 1
- [x] 2.3 Users table already exists (Phase 1 migration)

## 3. Backend - Auth API Routes

- [x] 3.1 Update `backend/app/api/v1/auth.py` with Redis token storage (login returns UUID token stored in Redis)
- [x] 3.2 Auth router already registered

## 4. Backend - Dependencies Update

- [x] 4.1 Update `backend/app/dependencies.py`: replace JWT validation with Redis token lookup
- [x] 4.2 `get_current_user` now checks Redis for token validity
- [x] 4.3 Redis connection check on backend startup (lifespan)

## 5. Frontend - Dependencies & Config

- [x] 5.1 Add `axios` to `frontend/package.json`
- [x] 5.2 Create `frontend/.env` with `REACT_APP_API_BASE_URL=http://localhost:8081`

## 6. Frontend - Auth Infrastructure

- [x] 6.1 Create `frontend/src/utils/request.ts` with axios instance and Bearer token interceptor
- [x] 6.2 Create `frontend/src/services/authService.ts` with login, register, logout API calls
- [x] 6.3 Create `frontend/src/contexts/AuthContext.tsx` with isAuthenticated, user, login, logout
- [x] 6.4 401 response interceptor redirects to /login

## 7. Frontend - Auth Pages

- [x] 7.1 Create `frontend/src/pages/LoginPage.tsx` with username/password form
- [x] 7.2 Create `frontend/src/pages/RegisterPage.tsx` with username/password form

## 8. Frontend - Routing & Guard

- [x] 8.1 Create `frontend/src/components/common/ProtectedRoute.tsx`
- [x] 8.2 Update `frontend/src/App.tsx` with /login and /register routes
- [x] 8.3 ProtectedRoute wraps protected routes
- [x] 8.4 AppLayout updated with user info and logout button

## 9. Frontend - Service Layer (FOLLOW-UP)

- [x] 9.1 Create `frontend/src/services/projectService.ts` with real API calls
- [x] 9.2 Update `frontend/src/hooks/useProjects.ts` to use projectService async API
- [x] 9.3 Update services with async API + mock fallback: applications, requirements, defects, documents

## 10. Integration & Testing

- [x] 10.1 Backend register: `curl -X POST http://localhost:8081/api/v1/auth/register -d '{"username":"test","password":"test123"}'` ✓
- [x] 10.2 Backend login returns UUID token stored in Redis ✓
- [x] 10.3 Backend logout removes token from Redis ✓
- [x] 10.4 Backend validates tokens via Redis (401 on invalid) ✓
- [ ] 10.5 Frontend: npm install && npm start (manual)
- [ ] 10.6 Frontend: Navigate to /login, register, login, verify redirect
- [ ] 10.7 Frontend: Verify token in localStorage
- [ ] 10.8 Frontend: Verify logout clears token

**Note:** Services now have both sync (mock) and async (API) versions for backwards compatibility. Complex services (reviews, testing, acceptance, builds, overview) still use mock data as they require deeper refactoring.

# Healix Backend (Supabase + Express)

Production-oriented backend service for Healix using:

- Node.js + Express
- Supabase (Postgres + Auth + Storage)
- JWT auth with role-based route protection
- Swagger docs
- Rate limiting, validation, centralized error handling

## Folder Structure

```txt
backend/
  src/
    config/
    controllers/
    docs/
    middleware/
    models/
    routes/
    services/
    utils/
    app.js
    server.js
  supabase/migrations/001_init.sql
  postman/Healix.postman_collection.json
  tests/health.test.js
  Dockerfile
  .env.example
  package.json
```

## Environment

Copy `.env.example` to `.env` and fill values:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_STORAGE_BUCKET`

## Setup

```bash
cd backend
npm install
npm run dev
```

Service base URL: `http://localhost:4000`

- Health: `GET /api/v1/health`
- Swagger: `GET /docs`

## Supabase Setup

1. In Supabase SQL editor, run: `supabase/migrations/001_init.sql`
2. Create bucket if not created by SQL: `medical-records`
3. Ensure your project has Email/Password auth enabled.

## API Overview

### Auth
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout` (auth required)
- `GET /api/v1/auth/me` (auth required)

### Users
- `GET /api/v1/users/profile` (auth required)
- `PATCH /api/v1/users/profile` (auth required)

### Doctors
- `GET /api/v1/doctors`
- `GET /api/v1/doctors/:id`
- `GET /api/v1/doctors/:id/availability`

### Appointments
- `POST /api/v1/appointments` (patient)
- `PATCH /api/v1/appointments/:id/cancel` (patient/doctor owning appointment)
- `GET /api/v1/appointments` (patient/doctor/admin scoped)

### Medical Records
- `POST /api/v1/medical-records/upload` (multipart `file`)
- `GET /api/v1/medical-records`

### Notifications
- `POST /api/v1/notifications` (doctor/admin)
- `GET /api/v1/notifications` (auth user feed)

## Testing

```bash
npm test
```

## Deployment

### Render / Railway
1. Deploy from `backend/` root.
2. Set all env vars from `.env.example`.
3. Start command: `npm start`.

### Docker

```bash
cd backend
docker build -t healix-backend .
docker run -p 4000:4000 --env-file .env healix-backend
```

## Frontend Integration Notes

- Frontend sends Supabase access token as `Authorization: Bearer <token>`.
- Backend validates token using Supabase Auth and resolves role from `public.users`.
- Use backend endpoints for protected business operations and uploads.

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

### Render (recommended)

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In [Render](https://render.com): **New** → **Blueprint**, connect the repo, apply `render.yaml` at the repository root.
3. In the Render dashboard for **healix-backend**, open **Environment** and set the secret variables (marked `sync: false` in the blueprint):
   - `FRONTEND_ORIGIN` — your Vite app URL(s), comma-separated if you use production + preview, e.g. `https://healix.vercel.app,https://healix-git-main-xxx.vercel.app`
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET` (from Supabase **Project Settings → API** and **JWT Secret**)
4. Deploy. Health check: `GET https://<your-service>.onrender.com/api/v1/health`  
   Render injects `PORT` automatically; the app listens on `process.env.PORT`.

### Railway

1. **New Project** → **Deploy from GitHub** → select the repo.
2. **Add service** → **Dockerfile**: set root directory to `backend` (or use empty Dockerfile path with root `backend`).
3. Add the same environment variables as in `.env.example`.
4. Railway sets `PORT`; no change needed in code.

### Docker (any host)

```bash
cd backend
docker build -t healix-backend .
docker run -p 4000:4000 --env-file .env healix-backend
```

### Frontend after deploy

Set `VITE_API_BASE_URL` on Vercel to your backend public URL, e.g. `https://healix-backend.onrender.com`.

## Frontend Integration Notes

- Frontend sends Supabase access token as `Authorization: Bearer <token>`.
- Backend validates token using Supabase Auth and resolves role from `public.users`.
- Use backend endpoints for protected business operations and uploads.

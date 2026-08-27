# Skillstream Academy — Frontend Web App

Next.js app with role-based routing for Student Portal, Instructor Dashboard, and Admin Console (deferred).

## Getting started

```bash
cd frontend/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@skillstream.academy | password123 |
| Instructor | instructor@skillstream.academy | password123 |
| Admin | admin@skillstream.academy | password123 |

## Routes

| Path | Role | Purpose |
|------|------|---------|
| `/login` | Public | Sign in |
| `/student/courses` | Student | Published course catalog |
| `/instructor/courses` | Instructor | List and create courses |
| `/instructor/courses/new` | Instructor | Create course form |
| `/instructor/courses/[id]/modules` | Instructor | Module and lesson editor |
| `/admin` | Admin | Phase 6 placeholder |

## Data

Development data is stored in `data/store.json` (JSON file DB). Replace with a real database when the backend services are built.

## Design

Uses the Ink & Paper palette from the design docs:
- Ink `#1C1D1B`, Paper `#FAF8F3`, Amber `#B08D2F`

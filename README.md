# Skillstream Academy — Frontend Web App

Next.js app for a single academy: enroll, learn, and certify. Students and instructors sign in from `/login`. Admins sign in at `/admin/login`.

## Getting started

```bash
cd frontend/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env` with `OPENAI_API_KEY` for the lesson assistant and PDF course draft, and `SESSION_SECRET` for the signed session cookie. Restart the dev server after changing it.

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@skillstream.academy | password123 |
| Instructor | instructor@skillstream.academy | password123 |
| Admin | admin@skillstream.academy | password123 |

Passwords are stored as bcrypt hashes. The session cookie is signed, expires in 7 days, and logout revokes it.

## Routes

| Path | Role | Purpose |
|------|------|---------|
| `/login` | Public | Student or instructor sign-in and account creation |
| `/admin/login` | Public | Admin sign-in |
| `/student/courses` | Student | Published course catalog |
| `/student/learning` | Student | Enrolled courses and the lesson player |
| `/student/certificates` | Student | Issued certificates and PDF download |
| `/instructor/courses` | Instructor | Drafts, submitted courses, and published courses |
| `/instructor/courses/new` | Instructor | Create a draft |
| `/instructor/courses/from-pdf` | Instructor | Draft a course from a PDF |
| `/instructor/courses/[id]/modules` | Instructor | Module and lesson editor |
| `/admin/courses` | Admin | Review queue: publish or send back |
| `/verify` | Public | Look up a certificate reference |

## Data

Local development data is stored in `data/store.json`. A hosted deploy needs a relational database; writes to this file do not persist there.

## Design

Teal on slate. Brand `#0F766E`, ink `#0F172A`, canvas `#F8FAFC`. Green is reserved for completed work.

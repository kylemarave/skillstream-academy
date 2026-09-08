# Skillstream Academy — Development Checklist

Single-academy learning platform. Job: connect enrollment, course access, completion, and a publicly verifiable credential.

**Journey:** Enroll → Learn → Get certified

**Integrations**
- Enrollment → LMS access — Live
- Completion → Certificate — Live
- AI assistant → Instructor escalation — Planned

**Rule:** Planned work stays labeled Planned. Do not ship UI that looks finished if it is not wired.

---

# System list

## Roles
- Student — browse catalog, enroll, complete lessons, share a certificate
- Instructor — author modules/lessons, publish, view roster/progress
- Admin — placeholder now; review, users, and system health later
- Public — verify a certificate by reference with no login

## Data model
- Identity — users, user_sessions
- Learning — courses, course_modules, lessons, enrollments, lms_accounts, lesson_progress
- Credential / money — certificates, payments
- AI / comms — ai_conversations, ai_messages, escalations, notifications
- Ops — integration_events, audit_logs

## Already working
- Role login (student, instructor, admin)
- Instructor create course, modules, lessons, publish
- Student catalog and enrollment
- LMS account created on enroll
- Lesson player with progress
- Completing all lessons marks enrollment completed
- Certificate issued on completion
- Public /verify by reference
- Basic instructor roster
- Landing page
- Confirm-before dialog + after-success notice on every live mutating action

## Not built — keep labeled Planned
- Hashed production auth
- Relational database
- Real payments
- PDF certificate files
- AI chat
- Escalation inbox
- Admin operations
- Edit / delete authoring
- Notifications
- Integration-event retries
- Audit logs

## Out of V1
- Dark mode
- Multi-tenancy / institution branding
- Co-teaching
- Native mobile app
- Advanced analytics / personalized recommendations
- Blockchain certificate anchoring

---

# Phase 0 — Foundations

- [x] Product purpose: enroll → learn → certify, public verification
- [x] ERD + entity spec for V1 (single academy, one instructor per course)
- [ ] Sign-off on ERD
- [ ] Choose payment provider
- [ ] Confirm one payment per enrollment (no subscriptions)
- [ ] Confirm one active enrollment per student per course
- [ ] Define refund policy
- [ ] Define PII / data-retention period
- [ ] Define escalation SLA
- [ ] Define max integration-event retries
- [ ] Confirm currency (default USD)
- [ ] Decide certificate tamper-evidence (signed record + public lookup)
- [ ] Decide if external_lms_id is used in V1 or reserved

---

# Phase 1 — Core product path

Keep this path real. A student must be able to enroll, finish lessons, and verify a certificate without editing seed data.

## 1.1 Student enrollment
- [x] Enroll in a published course
- [x] Create linked lms_accounts on enroll
- [x] Block duplicate open enrollments
- [x] Student sees the course as active after enroll
- [x] Confirm enrollment before it runs; success banner after
- [ ] Honor full status path: pending → confirmed → active → completed (today enroll jumps to active)
- [ ] Payment-failed UI state
- [ ] Provisioning-in-progress UI state
- [ ] Provisioning-failed UI state
- [ ] Emit enrollment.confirmed into integration_events

## 1.2 Student course player
- [x] Module navigation + lesson body
- [x] Persist lesson_progress (in_progress / completed)
- [x] Completing the last lesson sets enrollment to completed
- [x] Confirm before marking a lesson complete; success banner after
- [ ] Real quiz / assignment scoring (quiz/assignment currently auto-score 100)
- [ ] Video, quiz, and assignment lesson types (create is text-only today)
- [ ] Lesson duration and content URL/body in authoring

## 1.3 Certificates
- [x] Issue certificate only when enrollment is completed
- [x] Server-generated reference (SSA-YYYY-XXXXXX)
- [x] Student certificate list + detail
- [x] Public /verify with no login
- [x] Confirm before looking up a reference; result page is the after-confirm
- [x] Copy reference confirms with “Copied”
- [ ] PDF file + real file_url (today file_url points at /verify/...)
- [ ] Revoke / verification_status = revoked
- [ ] Emit enrollment.completed into integration_events

## 1.4 Authentication
- [x] Role login + role-based route protection
- [x] Logout
- [x] Confirm before sign in and log out; success banners after
- [ ] Hash passwords (bcrypt/Argon2) — store still has plaintext password
- [ ] Signed, expiring sessions (user_sessions)
- [ ] Revoke session on logout
- [ ] Password recovery
- [ ] Remove plaintext credentials from data/store.json
- [ ] Stop encoding session as a client-readable Base64 cookie

Done when: role access cannot be changed by editing a cookie.

## 1.5 Database
- [x] JSON file store (data/store.json) for local demo
- [ ] Relational DB matching the approved ERD
- [ ] Versioned migrations
- [ ] Seed data (demo student / instructor / admin + sample course)
- [ ] Concurrent writes that do not overwrite courses/modules/lessons

Done when: two simultaneous edits cannot clobber each other.

---

# Phase 2 — Instructor and admin workflow

## 2.1 Course authoring
- [x] Create course (draft)
- [x] Add modules and lessons
- [x] Publish from the course page
- [x] Warn before publishing a course with no lessons
- [x] Confirm before create / add module / add lesson / publish / unpublish
- [x] Success notice after those mutations
- [ ] Edit course title, description, price
- [ ] Edit / delete modules and lessons
- [ ] Lesson type, content URL/body, duration, quiz config
- [ ] Reorder modules/lessons (sequence_order)
- [ ] Autosave or explicit save confirmation
- [ ] Completeness checklist before publish
- [ ] Archive course without deleting enrollments

## 2.2 Admin course review
- [ ] Submit for review
- [ ] Approve / return with feedback
- [ ] Archive and reassign instructor
- [ ] Review state separate from public draft | published | archived
- [ ] Move publish permission from instructor to admin (if that stays the V1 rule)

## 2.3 Roster and progress
- [x] List enrolled students per course
- [x] Progress % and certificate reference
- [ ] Last activity timestamp
- [ ] Needs-attention filter
- [ ] Student detail view

## 2.4 AI assistant + escalation
- [ ] Student chat (ai_conversations + ai_messages)
- [ ] Ground replies in enrollment progress (context_snapshot)
- [ ] Escalation when the assistant cannot resolve
- [ ] Instructor inbox: pending / in progress / resolved
- [ ] Conversation context + linked course/module
- [ ] Instructor response + resolution notes
- [ ] Student-visible escalation status
- [ ] Notify student on status change
- [ ] Keep /instructor/escalations as Planned until this is wired — do not fake live data

## 2.5 Interaction feedback
- [x] Confirm dialog before every live mutating action
- [x] Success notice after every live mutating action
- [x] Route-level loading
- [ ] Retry on network/server failure
- [ ] Confirm destructive actions for edit/delete when those exist

---

# Phase 3 — Payments, events, notifications

## 3.1 Payments
- [ ] payments record per enrollment
- [ ] Amount matches course price at purchase time
- [ ] Provider + provider_ref
- [ ] Status: pending | succeeded | failed | refunded
- [ ] Enrollment → confirmed only after succeeded
- [ ] Demo copy stays honest until this is live (no fake paid receipts)

## 3.2 Integration events
- [ ] Write enrollment.confirmed and enrollment.completed
- [ ] Status: pending | processing | succeeded | failed
- [ ] Retry with backoff + retry_count / last_error
- [ ] Enrollment becomes active only when LMS sync_status = provisioned
- [ ] Reconciliation so a paid student cannot sit in confirmed + failed forever

## 3.3 Notifications
- [ ] lms_account_ready
- [ ] certificate_issued
- [ ] escalation_update
- [ ] enrollment_confirmed
- [ ] payment_failed
- [ ] In-app unread / read (read_at)
- [ ] Notification preferences

## 3.4 Audit logs
- [ ] Append-only log for enrollments, certificate issue/revoke, payments, admin actions
- [ ] Actor, action, target, metadata
- [ ] No updates or deletes

---

# Phase 4 — Admin ops and hardening

## 4.1 Admin console
- [ ] /admin/courses — publish, archive, reassign
- [ ] /admin/enrollments — search and repair bad records
- [ ] /admin/system-health — failed events, retry, reconcile
- [ ] /admin/users — accounts, roles, suspend/deactivate
- [ ] Audit log browser
- [ ] Basic reporting
- [ ] User status: active | suspended | deactivated (no hard delete)

## 4.2 Catalog discovery
- [x] Published course list
- [ ] Search
- [ ] Topic / price filters
- [ ] Sort + pagination
- [ ] Outcomes, duration, level, prerequisites
- [ ] Instructor profile (users.bio)

## 4.3 Responsive and accessibility
- [x] Shared buttons, cards, fields, labels
- [x] Focus states, skip link, 44px controls, reduced motion
- [ ] QA at 375 / 768 / 1024 / 1440
- [ ] Keyboard-only + screen-reader names
- [ ] Contrast + 200% zoom
- [ ] Automated a11y checks in CI

## 4.4 Design system
- [ ] Empty-state and data-list components
- [ ] Storybook or equivalent
- [ ] Document responsive, content, and a11y rules
- [ ] Update README (it still mentions the old Ink & Paper palette)

---

# Quality gates

Check these before calling a phase done.

- [ ] Student can finish enroll → learn → certify without editing seed data
- [ ] Instructor can publish a course and see roster progress
- [ ] Public verify works with no account
- [ ] Planned features (AI, payments, PDF, admin) are labeled Planned
- [ ] No invented testimonials, payments, or AI answers
- [ ] Certificate reference is never client-supplied
- [ ] Role changes only via admin
- [ ] Tests for enrollment, progress → completion, certificate uniqueness, verify lookup
- [ ] Accessibility check on player, roster, verify, and authoring

---

# Action confirmation list

**Before** = ask first (Are you sure?)
**After** = tell them it worked or failed
**Loading** = button/page shows work in progress

## Public

- [x] Sign in
  Before: Done — “Sign in as Student / Instructor / Admin?”
  After: Done — “Signed in” banner on the workspace
  Loading: Done — “Signing in…”
  Fail: Done — inline error

- [x] Verify certificate
  Before: Done — “Look up this certificate?”
  After: Done — result page (“Certificate verified” or “No matching certificate”)
  Loading: Done — “Checking…”
  Fail: Done — inline error on a miss

- [x] Copy certificate reference
  Before: N/A
  After: Done — button flips to “Copied”
  Fail: Done — inline error if the clipboard is blocked

## Student

- [x] Enroll in a course
  Before: Done — “Enroll in this course?”
  After: Done — “Enrollment confirmed” banner on the course
  Loading: Done — “Enrolling…”
  Fail: Done — inline error

- [x] Complete a lesson
  Before: Done — “Mark this lesson complete?”
  After: Done — “Lesson complete” banner
  Loading: Done — “Saving…”
  Fail: Done — inline error

- [x] Finish the last lesson / receive certificate
  Before: Done — “Finish the course?”
  After: Done — “Certificate issued” banner on the certificate page
  Loading: Done

- [x] Log out
  Before: Done — “Log out?”
  After: Done — “Signed out” banner on login
  Loading: Done

## Instructor

- [x] Create course
  Before: Done — “Create this course?”
  After: Done — “Course created” banner on modules
  Loading: Done — “Creating…”
  Fail: Done — inline error

- [x] Add module
  Before: Done — “Add this module?”
  After: Done — “Module added”
  Loading: Done
  Fail: Done — inline error

- [x] Add lesson
  Before: Done — “Add this lesson?”
  After: Done — “Lesson added”
  Loading: Done
  Fail: Done — inline error

- [x] Publish course
  Before: Done — “Publish this course?”
  After: Done — “Published”
  Loading: Done
  Fail: Done — inline error

- [x] Return course to draft
  Before: Done — “Return this course to draft?”
  After: Done — “Returned to draft”
  Loading: Done
  Fail: Done — inline error

## Not built yet — add Before + After when you ship them

- [ ] Edit course / module / lesson — After = “Saved”
- [ ] Delete course / module / lesson — Before required, After = “Deleted”
- [ ] Reorder modules / lessons — After = “Order saved”
- [ ] Approve / return / archive / reassign a course
- [ ] Retry a failed LMS or certificate sync
- [ ] Suspend / deactivate a user
- [ ] Change a user role
- [ ] Revoke a certificate
- [ ] Refund / mark payment failed
- [ ] Resolve an escalation
- [ ] Retry a failed integration event

## System-wide rules

- [x] Shared confirm dialog for live mutations
- [x] Shared success notice (banner or inline)
- [x] Confirm before any action that hides a course or signs the user out
- [x] Do not confirm simple navigation (Open course, Next lesson, Back)
- [x] Planned features must not show a fake “Success”
- [ ] Shared retry for network/server failure

---

# Suggested build order

1. Auth + database
2. Authoring edit / delete (include confirm + success on those new actions)
3. Payments + enrollment lifecycle (pending → confirmed → active)
4. Integration events + retries
5. AI + escalations
6. Admin ops + notifications

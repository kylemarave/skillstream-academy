# Skillstream Academy UI Backlog

Updated: August 27, 2026

## Completed in the professional UI pass

- Replaced the basic top navigation with a responsive, role-aware application shell.
- Added an academic editorial display typeface while keeping a legible UI sans-serif.
- Standardized color, border, spacing, focus, form, selection, and motion tokens.
- Redesigned the student and instructor dashboards around their primary workflows.
- Reworked dashboard statistics, journey progress, connected-system explanations, and quick actions.
- Improved the login experience with role selection, clearer product context, and accessible feedback.
- Improved the course catalog, course library, course setup form, and module editor.
- Added a working draft-to-published course control for instructors.
- Added loading, disabled, empty, and error treatment to core authoring interactions.
- Added branded loading and not-found routes.
- Removed dead footer links and labeled the project status honestly.
- Added visible focus states, a skip link, minimum control heights, and reduced-motion support.

## P0 — Required for a usable capstone demo

### Complete student enrollment

- Replace the disabled enrollment control with a working enrollment flow.
- Capture enrollment confirmation and create the linked LMS account.
- Show success, payment failure, provisioning-in-progress, and provisioning-failed states.
- Acceptance: a student can enroll and see the course become active without editing seed data.

### Build the student course player

- Add module navigation, lesson content, completion controls, and course progress.
- Persist `lesson_progress` for each enrollment.
- Acceptance: completing the final lesson changes the enrollment to completed.

### Implement certificate issuance and verification

- Generate a certificate record when course completion occurs.
- Add student certificate history and a public reference-number verification page.
- Acceptance: a completed enrollment produces a certificate that can be verified without signing in.

### Replace demo authentication

- Hash passwords and use signed, expiring sessions.
- Add logout revocation, route protection, and password recovery.
- Remove plaintext credentials from `data/store.json`.
- Acceptance: role access cannot be changed by modifying a client-readable cookie.

### Replace the JSON file store

- Introduce a relational database matching the approved ERD.
- Add migrations and seed data.
- Acceptance: concurrent requests cannot overwrite course, module, or lesson changes.

## P1 — Required for the complete instructor workflow

### Finish course authoring

- Edit and delete course details, modules, and lessons.
- Support lesson type, content URL/body, duration, quiz configuration, and ordering.
- Add autosave or explicit save confirmation.
- Add a course completeness checklist before publishing.

### Add admin course review

- Move publishing permission from instructors to admins.
- Add submit-for-review, approve, return-with-feedback, archive, and reassign actions.
- Display review state separately from public course status.

### Build roster and progress monitoring

- List enrolled students by course.
- Show progress percentage, last activity, completion date, and students needing attention.
- Add an accessible student detail view.

### Build the AI escalation inbox

- List pending, in-progress, and resolved escalations.
- Show conversation context, linked course/module, assignment, response, and resolution.
- Notify the student when status changes.

### Add complete interaction feedback

- Add toast or inline success confirmation for course, module, and lesson mutations.
- Add skeletons for route-level loading.
- Add retry actions for network and server failures.
- Add confirmation for destructive actions.

## P2 — Professional product hardening

### Responsive and accessibility QA

- Test at 375, 768, 1024, and 1440 pixel widths.
- Verify keyboard-only navigation and screen-reader names.
- Run contrast and zoom checks at 200%.
- Add automated accessibility checks to CI.

### Catalog discovery

- Implement search, topic filters, price filters, sorting, and pagination.
- Add course outcomes, duration, level, prerequisites, and instructor profile.

### Notifications

- Add in-app notifications for enrollment, LMS access, escalation updates, and certificates.
- Add read/unread state and notification preferences.

### Admin operations

- Build system-health views for failed integration events.
- Add retry and reconciliation controls.
- Add user management, audit log browsing, and basic reporting.

### Production design-system work

- Extract shared button, field, empty-state, data-list, and page-header components.
- Add Storybook or an equivalent component reference.
- Document responsive, content, and accessibility rules.

## Deferred beyond V1

- Dark mode.
- Multi-tenancy and institution branding.
- Co-teaching.
- Native mobile application.
- Advanced analytics and personalized learning recommendations.

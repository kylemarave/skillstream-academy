# Skillstream Academy UI Backlog

Updated: August 27, 2026

## Design system

The palette is functional: every hue has exactly one job, so colour carries
meaning rather than decoration.

| Role | Token | Value | Used for |
| --- | --- | --- | --- |
| Brand | `--brand` | `#0F766E` | Links, primary buttons, current step, active nav |
| Complete | `--success` | `#15803D` | Published courses, finished steps, certification |
| Unfinished | `--warn` | `#B45309` | Drafts and "not ready to publish" warnings |
| Failed | `--danger` | `#B91C1C` | Errors only |
| Text | `--ink` / `--muted` | `#0F172A` / `#475569` | Primary and secondary text |
| Structure | `--canvas` / `--surface` / `--line` | `#F8FAFC` / `#FFFFFF` / `#E2E8F0` | Page, cards, hairline borders |

Teal is the base because the product is a learning platform whose payoff is a
credential: green reads as "achieved" and stays reserved for that, so the
interactive colour has to sit next to it without competing. Slate neutrals keep
the reading surface quiet. All text pairs clear 4.5:1 on both `--canvas` and
`--surface`.

## Completed in the minimal redesign

- Replaced the amber "Ink & Paper" palette with the functional teal/slate system above.
- Dropped the serif display face; one sans family now carries the whole hierarchy.
- Added shared `.btn`, `.card`, `.field`, and `.label` primitives so controls stop drifting.
- Converted the dark sidebar to a light one and merged the breadcrumb strip into a single page header with an actions slot.
- Reduced the journey stepper to one progress row and removed it from the four pages that only repeated it.
- Replaced the decorative "connected systems" panel with a plain list that labels each handoff as planned.
- Replaced the course detail pipeline graphic with real counts of modules and lessons.
- Removed the drag handle in the module editor, which implied reordering that does not exist.
- Removed the fake dashboard and certificate mockups from the landing page.
- Warned before publishing a course that has no lessons.
- Kept visible focus states, the skip link, 44px control heights, and reduced-motion support.

### Behaviour changes worth knowing

- "Publish immediately" was removed from course creation; publishing now happens
  from the course page, where the empty-content warning can be shown.
- The landing navigation no longer has a mobile menu; the section links are
  hidden below `md` and the page is short enough to scroll.

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

- Extract empty-state and data-list components (button, field, card, and page header are done).
- Add Storybook or an equivalent component reference.
- Document responsive, content, and accessibility rules.

## Deferred beyond V1

- Dark mode.
- Multi-tenancy and institution branding.
- Co-teaching.
- Native mobile application.
- Advanced analytics and personalized learning recommendations.

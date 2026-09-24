# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: a faculty member or similar evaluator judging the capstone. They must walk enroll → learn → certify on a demo account and see that those steps actually run, without features that look finished but are not.

Also real: students (browse, enroll, complete lessons, share a certificate reference) and instructors (author modules/lessons, publish, view roster/progress). Admin exists as a placeholder and is not the lead audience.

## Product Purpose

Skillstream Academy is a single-academy learning platform whose job is to connect enrollment, course access, completion, and a publicly verifiable credential so nobody has to chase those handoffs by hand.

Success for the primary user: they can sign in as student and instructor, complete the published path, and verify a certificate without logging in — and they can still see the rest of the intended V1 (lesson chatbot, PDF certificates) labeled as planned rather than missing.

## Positioning

Two claims a generic LMS install would not automatically make true:

1. Confirming enrollment provisions course access; finishing every lesson issues the credential — those handoffs are the product, not add-ons.
2. The credential is checkable by anyone with a server-generated reference number; verification does not require an account.

## Operating Context

Evaluators use seeded demo accounts (student, instructor, admin) on a local Next.js app. Data lives in a JSON file store until a real database exists. Courses are free; confirming enrollment sets up course access.

V1 scope from the approved ERD: one academy, one instructor per course. The human journey is enroll → learn → get certified. Supporting integrations in the model: registration ↔ LMS, LMS ↔ certificates, and a lesson chatbot. The chatbot answers a student’s question about a lesson using only that course’s lesson text. If the lessons do not contain the answer, it says so and stops. It does not send the question to the instructor.

## Capabilities and Constraints

Working in this prototype: role login, instructor course/module/lesson create and publish, student catalog and enrollment, LMS account provisioned on enroll, lesson player with progress, enrollment completed when all lessons are done, certificate issued on completion, public `/verify` by reference.

Not implemented and must not be presented as live: hashed production auth, relational database, PDF certificate files, the lesson chatbot, admin operations. The course question box still files a pending escalation; that is not the chatbot.

Open tension (confirmed both): the judged path must not fake completion; the full V1 story (including the lesson chatbot) stays visible where it is not built. Record planned work as planned. Do not invent an assistant answer before the model is connected.

Terminology: enrollment, LMS access/provisioning, lesson progress, certificate reference, public verification, lesson chatbot.

## Brand Commitments

Name: Skillstream Academy. Voice: plain, academic, specific about what works vs what is planned. No invented schools, testimonials, or press.

Public footer, on the landing page, sign-in, and verify: “Skillstream Academy · Enroll, learn, and verify a certificate,” a link to `/verify`, and © 2026. It does not say “academic project” or “no real student data,” because the site is deployed.

Visual identity is the LMS category standard, executed at the craft level of Canvas, Moodle, and Coursera: teal on slate, type-first marketing, Sign in as the primary action. No metaphor worlds.

## Evidence on Hand

Demo logins and seed course content in `data/store.json`. Public verification of issued references at `/verify`. No customer quotes, case studies, or real certificate PDFs. Future work must not fabricate them.

## Product Principles

1. The enroll → learn → certify path the evaluator walks must be real.
2. Planned V1 stays in the story, labeled planned — never dressed as live.
3. A certificate is a public reference, not a login-walled badge.
4. Students and instructors are both in the product; the first-run is for the person judging that both sides exist.
5. Do not invent proof or AI answers to look more complete.

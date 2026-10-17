# OLX-Clone Client — Phased Implementation Plan

> **Project:** Free Video-First Marketplace  
> **Target launch:** 5 November 2026  
> **Current phase:** Phase 0 — Client foundation and route visibility  
> **Frontend:** Next.js App Router + TypeScript  
> **Status:** Structure and navigable placeholder UI only

---

## 1. Purpose of This File

This document is the implementation contract for every AI coding agent and developer working on the client application.

The goal is to build the application in small, reviewable phases without allowing generated code to become inconsistent, duplicated, or difficult to maintain. Read this file before making changes. Update its phase checklist only when the corresponding work has actually been completed and verified.

**Current instruction:** Implement Phase 0 only. Do not begin Phase 1 or any later phase unless explicitly instructed.

## 2. Product Direction

The long-term product is an India-focused, free-to-use, video-first marketplace combining:

- Marketplace listings and category discovery
- Reels and short-video discovery
- Search and location-based browsing
- User and business profiles
- Buyer–seller chat
- Jobs and services
- An admin panel for operations and moderation

Core consumer usage is intended to remain free. Paid business tools, advertising, sponsored content, payment integrations, delivery integrations, and other monetization features are not part of the initial foundation.

The architecture should leave room for future growth, but **do not build future features before their phase**.

## 3. Non-Negotiable AI Coding Rules

Every agent must follow these rules:

1. **Inspect before editing.** Review the existing project, `package.json`, routing setup, installed dependencies, and this file before making changes.
2. **Do not overwrite working code blindly.** Preserve existing valid implementation and make the smallest coherent change.
3. **One phase at a time.** Do not implement tasks from later phases as a bonus.
4. **No speculative infrastructure.** Do not add libraries, providers, abstractions, or services until a current requirement needs them.
5. **No monolithic files.** Keep route pages small and move reusable presentation into suitable shared components.
6. **No duplicated design systems.** Reuse shared layout, typography, spacing, colors, buttons, and cards instead of inventing new styles per page.
7. **No fake functionality.** A visible placeholder must not imply that a feature works when it does not.
8. **No authentication gates until explicitly scheduled.** Public routes and placeholder routes must remain directly visitable in the current phase.
9. **No automatic redirects to login.** Do not redirect `/`, `/sell`, `/chats`, `/favourites`, `/profile/example`, or admin paths to authentication.
10. **No secrets in source control.** Future configuration belongs in environment variables; do not add real credentials.
11. **Keep TypeScript strict and meaningful.** Do not use `any` to silence errors or add unsafe casts without a clear reason.
12. **Avoid unnecessary dependencies.** Prefer existing framework capabilities and installed packages.
13. **Do not create dead scaffolding.** Create the requested directories and files when useful, but do not fill feature folders with speculative services, hooks, stores, or API code.
14. **Keep changes reviewable.** After each task, report files changed, checks run, known limitations, and the next phase—not a list of features that were merely planned.
15. **Do not claim success without verification.** Run available lint, type-check, build, and route checks when practical. Report any checks that could not be run.
16. **Do not remove or replace project configuration without a demonstrated need.** Explain the reason before making a significant configuration change.
17. **Do not introduce paid services or paid dependencies without explicit approval.**
18. **Update this document when a phase is completed.** Record actual completion and verification, not assumptions.

## 4. Current Phase — Phase 0: Foundation and Route Visibility

### Objective

Create the client folder structure and a consistent, responsive placeholder experience so a developer, client, or tester can open every planned route directly in a browser.

### In scope

- Inspect the existing project before changing it.
- Preserve or establish the Next.js App Router + TypeScript setup.
- Create the requested folder structure where applicable.
- Create a minimal shared root layout and global stylesheet.
- Create a small reusable placeholder-page component and a consistent basic navigation shell if useful.
- Make every route below resolve directly.
- Use simple, professional, responsive placeholder content.
- Use route-specific headings and a short description so the visitor knows which page they opened.
- Support dynamic route parameters such as `[slug]` and `[id]` without requiring real data.
- Provide a consistent not-found page and minimal loading/error handling where appropriate.
- Add `.env.example` only if needed, with variable names but no secrets.
- Add or maintain a `PROJECT_PHASES.md` file at the client project root.
- Confirm that the application starts and that routes render.

### Explicitly out of scope

Do **not** implement any of the following in Phase 0:

- Login, registration, OTP, sessions, JWT, refresh tokens, or auth guards
- Role-based permissions or protected routes
- Backend integration, API routes, database connections, or ORM setup
- Real listings, search logic, filters, sorting, or location lookup
- Video uploads, playback pipelines, transcoding, object storage, or CDN setup
- Working chat, Socket.IO, notifications, or messaging
- Working sell/listing submission forms
- Favorites persistence, follows, comments, reviews, or offers
- Admin operations, moderation actions, audit logging, or user management
- Payments, subscriptions, ads, sponsored Reels, premium features, or paid third-party services
- AI recommendations, AI content generation, or advanced analytics
- Fake authentication, fake APIs, fake database records presented as real, or non-functional controls that pretend to work

A button may be omitted or clearly labelled as a placeholder. Do not make a control appear operational if it has no behavior.

### Route acceptance checklist

All of these routes must render when entered directly in the browser, without signing in:

#### Public pages
- [x] `/`
- [x] `/reels`
- [x] `/search`
- [x] `/categories/[slug]` — example: `/categories/cars`
- [x] `/listing/[id]` — example: `/listing/123`
- [x] `/business/[slug]` — example: `/business/example-store`
- [x] `/jobs`
- [x] `/services`

#### Authentication pages — placeholders only
- [x] `/login`
- [x] `/register`
- [x] `/verify-otp`

#### Account pages — placeholders only; never redirect to login
- [x] `/sell`
- [x] `/chats`
- [x] `/favourites`
- [x] `/profile/[id]` — example: `/profile/example-user`

#### Admin pages — placeholders only; no authorization checks in this phase
- [x] `/admin`
- [x] `/admin/users`
- [x] `/admin/listings`
- [x] `/admin/reels`
- [x] `/admin/reports`
- [x] `/admin/categories`
- [x] `/admin/verification`
- [x] `/admin/audit-logs`

#### Framework behavior
- [x] An unknown path displays the not-found page.
- [x] Refreshing a nested route does not produce a 404 caused by missing routing configuration.
- [x] Dynamic route segments render without requiring backend data.
- [x] The app is responsive at mobile, tablet, and desktop widths.
- [x] No route unexpectedly redirects to `/login`.
- [x] No console errors or TypeScript errors are introduced by this phase.
- [x] The production build succeeds, or any pre-existing failure is documented.

### Phase 0 completion criteria

Phase 0 is complete only when:

1. The requested route structure exists in the repository in a form appropriate for Next.js App Router.
2. Every route in the checklist can be visited directly.
3. Pages share a consistent visual foundation and are not empty white screens.
4. No authentication or backend dependency prevents navigation.
5. Available lint, type-check, and build checks have been run and their results reported.
6. This file accurately reflects the status.

## 5. Planned Development Phases

These are planning boundaries, not permission to implement them now. Confirm the actual launch scope with the client before treating any phase as contractually required.

### Phase 1 — Launch UI and Essential Marketplace MVP

**Goal:** Turn the placeholder experience into a coherent, demonstrable marketplace interface and implement only the core workflows agreed for the 5 November launch.

Potential scope, to be confirmed:
- Finalize visual identity, shared components, navigation, and responsive layouts.
- Build the public home/discovery page and category browsing experience.
- Build listing cards and listing detail UI.
- Build search and basic filters.
- Build a simple, usable sell/list flow.
- Establish the initial Reels viewing experience if it is essential to the launch.
- Build user/profile and favorites UI as agreed.
- Establish clear loading, empty, error, and success states.
- Agree on API contracts with the backend before wiring live data.

**Gate:** No broad backend integration until the page structure, shared components, and data contracts are reviewed.

### Phase 2 — Backend Integration and Secure Core Workflows

**Goal:** Connect the agreed MVP screens to real services.

Potential scope:
- API client, typed request/response contracts, and centralized error handling.
- Authentication and OTP only after the backend flow is ready.
- Real listing creation, reading, editing, and status handling.
- Search and filtering against real data.
- User profile and favorites persistence.
- Upload integration only after storage and media contracts are agreed.
- Rate limiting, authorization, validation, logging, and security checks handled with the backend team.

**Gate:** Each workflow must be tested against real backend behavior. Do not substitute mock success responses for missing APIs.

### Phase 3 — Launch Readiness and Operational Safety

**Goal:** Prepare the agreed MVP for real users.

Potential scope:
- End-to-end testing of launch-critical journeys.
- Responsive and browser compatibility checks.
- Accessibility and performance review.
- Empty, error, retry, loading, and offline/network failure states.
- Security review of authentication, authorization, data exposure, and user-submitted content.
- Production environment configuration, deployment checks, logging, and monitoring coordination.
- Client acceptance testing and a prioritized bug-fix pass.

**Gate:** Do not declare the application production-ready solely because the UI builds. Critical flows must work in the deployed environment.

### Phase 4 — Growth Features

Only after the initial release and explicit prioritization:
- Business profiles and advanced storefront features
- Follows, comments, reviews, and offer negotiation
- Saved searches and richer location/map discovery
- Advanced moderation and professional/dealer workflows
- Recommendation and listing-assistance features

### Phase 5 — Advanced and Monetized Features

Only after business approval, feasibility review, and a separate scope decision:
- Sponsored Reels and advertising
- Paid business subscriptions and professional tools
- Payment and transaction services where legally appropriate
- Delivery/shipping integrations
- AI-generated Reels and advanced recommendations
- Live video, calling, and advanced analytics

Paid services are **not** assumed to be part of the initial launch. Evaluate ongoing costs, provider lock-in, compliance, and operational ownership before proposing them.

## 6. Recommended Project Organization

Use the following as the intended client-side organization. Adapt only when the current repository or framework conventions require it; document material deviations.

```text
client/
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── reels/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   ├── categories/[slug]/page.tsx
│   │   │   ├── listing/[id]/page.tsx
│   │   │   ├── business/[slug]/page.tsx
│   │   │   ├── jobs/page.tsx
│   │   │   └── services/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── verify-otp/page.tsx
│   │   ├── (account)/
│   │   │   ├── sell/page.tsx
│   │   │   ├── chats/page.tsx
│   │   │   ├── favourites/page.tsx
│   │   │   └── profile/[id]/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── listings/page.tsx
│   │   │   ├── reels/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── verification/page.tsx
│   │   │   └── audit-logs/page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── loading.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── reels/
│   │   ├── listings/
│   │   ├── search/
│   │   ├── chat/
│   │   ├── forms/
│   │   └── admin/
│   ├── features/
│   │   ├── auth/
│   │   ├── marketplace/
│   │   ├── reels/
│   │   ├── chat/
│   │   ├── businesses/
│   │   ├── jobs/
│   │   ├── services/
│   │   └── moderation/
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── socket-client.ts
│   │   ├── query-client.ts
│   │   ├── auth.ts
│   │   ├── seo.ts
│   │   └── env.ts
│   ├── hooks/
│   ├── stores/
│   ├── i18n/
│   ├── types/
│   └── middleware.ts
├── tests/
│   ├── e2e/
│   └── unit/
├── .env.example
├── next.config.ts
├── package.json
├── tsconfig.json
└── PROJECT_PHASES.md
```

### Folder-structure notes

- Next.js route groups such as `(public)`, `(auth)`, and `(account)` do not appear in the URL.
- The root `/` page can live at `src/app/(public)/page.tsx`.
- A route group can share layouts without changing the URL, but do not introduce authentication redirects in Phase 0.
- `src/app/api/` is optional and must not be added until a real, agreed BFF requirement exists.
- `middleware.ts` should not implement authentication or route protection in Phase 0. If no middleware is needed yet, do not add it merely to fill the tree.
- `features/`, `hooks/`, `stores/`, `i18n/`, and `types/` may contain only the minimal structure needed now. Do not generate empty abstractions or speculative implementations.
- If a route is placed under a route group, ensure the final URL matches the acceptance checklist exactly.
- The admin layout may use a different visual shell, but admin pages must remain directly accessible in Phase 0.

## 7. Design and Placeholder Expectations

The Phase 0 interface should look intentional but remain lightweight.

- Use one shared visual language: consistent spacing, typography, borders, colors, and responsive rules.
- Use a simple project name or neutral brand placeholder if final branding is not yet available.
- Each page should clearly state its page name and that it is a placeholder under development.
- Add basic links to key routes if a shared navigation shell is used.
- Ensure long route names and dynamic identifiers do not break the layout.
- Avoid copying another marketplace's branding or exact interface.
- Do not add external image, font, analytics, or UI services unless they are already available and approved.
- Do not build a complex homepage in Phase 0; the root route only needs to be visibly rendered and navigable.
- Avoid forms that look submit-ready when no submission behavior exists.

## 8. AI Agent Workflow for Every Task

Before coding:
1. Read this file.
2. Inspect the repository and identify the current phase.
3. State the exact files likely to change and the scope of the task.
4. Identify any conflict with existing code or a phase boundary.

During coding:
1. Make only the smallest changes needed for the requested task.
2. Reuse existing components and styles.
3. Keep routes, components, types, and feature logic in their intended places.
4. Avoid unrelated formatting or refactoring.
5. Do not add future-phase features without approval.

After coding:
1. Run relevant lint/type-check/build/test commands available in the repository.
2. Verify affected routes directly where possible.
3. Review the diff for duplication, accidental deletions, unused dependencies, secrets, and scope creep.
4. Update this plan only with verified status.
5. Report:
   - What changed
   - Files created/modified
   - Commands/checks run and their actual results
   - Routes verified
   - Known gaps or failures
   - Whether the phase acceptance criteria are met

If an instruction conflicts with this file, stop and ask for clarification rather than silently expanding the scope.

## 9. Launch Planning Guardrail

The launch date is a deadline, not a reason to skip security or ship broken critical flows. Keep the initial release narrow and explicitly agreed with the client.

Prioritize:
1. The client’s must-have user journeys
2. A stable, understandable UI and codebase
3. Core marketplace functionality that can be tested end to end
4. Basic operational visibility and failure handling
5. Features that can safely be deferred

Defer paid integrations, advanced AI, advanced recommendations, live video/calling, delivery integrations, and monetization unless the client explicitly changes the scope.

Before committing to a launch feature list, confirm:
- Which user journeys must work on launch day
- Whether real backend services are ready and owned by the team
- Who provides and pays for hosting, storage, SMS/OTP, and other providers
- What the client will accept as a launch-ready MVP
- Who handles production support, monitoring, and post-launch defects

## 10. Phase Status

- [x] Phase 0 — Foundation and route visibility (COMPLETED & VERIFIED)
- [ ] Phase 1 — Launch UI and essential marketplace MVP
- [ ] Phase 2 — Backend integration and secure core workflows
- [ ] Phase 3 — Launch readiness and operational safety
- [ ] Phase 4 — Growth features
- [ ] Phase 5 — Advanced and monetized features

**Current authorization:** Phase 0 only.

Do not mark a phase complete until its acceptance criteria are verified and the result is reported.

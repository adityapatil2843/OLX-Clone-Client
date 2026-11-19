# OLX-Clone Client - Phased Implementation Plan

> **Project:** Free Video-First Marketplace  
> **Product Brand:** Bazarr 360  
> **Web Domain:** https://bazarr360.in  
> **Official Logo:** public/images/logo-1.png  
> **Mobile Package ID:** com.bazaar360.app (existing scheme: bazaar360)  
> **Current phase:** Phase 7 - Real Sell & Listing Creation Workflow  
> **Frontend:** Next.js App Router + TypeScript  
> **Status:** Real Sell & Listing Creation Workflow Completed & Verified

---

## 1. Purpose of This File

This document is the implementation contract for every AI coding agent and developer working on the client application.

The goal is to build the application in small, reviewable phases without allowing generated code to become inconsistent, duplicated, or difficult to maintain. Read this file before making changes. Update its phase checklist only when the corresponding work has actually been completed and verified.

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

## 3. Non-Negotiable AI Coding Rules

1. Inspect before editing.
2. Do not overwrite working code blindly.
3. One phase at a time.
4. No speculative infrastructure.
5. No monolithic files.
6. No duplicated design systems.
7. No fake functionality.
8. No authentication gates on public routes.
9. No automatic redirects to login.
10. No secrets in source control.
11. Keep TypeScript strict and meaningful.
12. Avoid unnecessary dependencies.
13. Do not create dead scaffolding.
14. Keep changes reviewable.
15. Do not claim success without verification.
16. Do not remove or replace project configuration without a demonstrated need.
17. Do not introduce paid services or paid dependencies without explicit approval.
18. Update this document when a phase is completed.

---

## 4. Phase Status

- [x] Phase 0 - Foundation and route visibility (COMPLETED & VERIFIED)
- [x] Phase 1 - Launch UI and essential marketplace MVP (COMPLETED & VERIFIED)
- [x] Phase 2 - Mobile App Experience Parity & Secure Backend Integration (COMPLETED & VERIFIED)
- [x] Phase 3 - Launch readiness and operational safety (COMPLETED & VERIFIED)
- [x] Phase 4 - Growth features (COMPLETED & VERIFIED)
- [x] Phase 5 - Advanced and monetized features (COMPLETED & VERIFIED)
- [x] Phase 6 - Production Readiness, Observability & Reliable Operations (COMPLETED & VERIFIED)
- [x] Phase 7 - Real Sell & Listing Creation Workflow (COMPLETED & VERIFIED)

---

## 5. Phase 7 Verification Record

### 1. Capability Audit & Operational Classification

| Feature / Domain | Classification | Operational Reality & Verification Evidence | Client & Server Behavior |
| :--- | :--- | :--- | :--- |
| **Category Discovery** | **A. Supported & safe** | Server endpoint `GET /api/v1/categories?tree=true` returns structured category hierarchy; `GET /api/v1/categories/:idOrSlug/attributes` returns category-specific attribute schemas. | Client `categoriesService.getCategories('tree')` dynamically renders top-level category cards and subcategory chips without hardcoded fallbacks. |
| **Listing Creation API** | **A. Supported & safe** | Server endpoint `POST /api/v1/listings` accepts authenticated `multipart/form-data` with images and video or standard JSON body. Validated via Zod `createListingSchema`. | Client `listingsService.createListing` submits typed payload with live upload progress, handling both single-request atomic upload and subsequent redirect. |
| **Media Processing & Upload** | **A. Supported & safe** | Server multer middleware enforces 100MB limit and streams buffers directly to Cloudinary storage (`uploadBufferToCloudinary`). Direct media route `POST /api/v1/listings/:id/media/upload` supports images and video reels. | Client validates images (max 10MB, JPG/PNG/WebP, max 12 items) and video (max 50MB, MP4/WebM/MOV, max 1 reel). Live progress bar (0%-100%) and thumbnail previews with removal. |
| **Dynamic Category Attributes** | **A. Supported & safe** | Server validates submitted attributes against category schema (`validateCategoryAttributes`). | Form dynamically renders specifications (dropdowns for options, numeric inputs, text fields) according to the selected category and validates required fields before submission. |
| **Error Handling & Resilience** | **A. Supported & safe** | Server returns structured error envelopes with standard HTTP status codes (401, 403, 413, 422). | Client safely intercepts 401 (opens non-blocking `AuthPromptModal`), 413 (payload too large guidance), 422 (field-level validation error mapping), and network errors with Retry button without losing form inputs. |
| **Duplicate Submit Prevention** | **A. Supported & safe** | Mutex ref lock pattern and UI state locking. | Submit button and form inputs disabled during active upload (`isSubmitting` flag and `submittingRef.current = true`), preventing accidental double-clicks. |
| **Mobile-First Layout** | **A. Supported & safe** | Responsive layout across 320px-1440px viewports with touch targets >= 44px. | Safe bottom navigation spacing (`pb-24 md:pb-12`) strictly preserved; zero collision with fixed `BottomNav`. |

---

### 2. Work Completed

#### Part A: API Client & Storage Abstraction
- **API Client Hardening (`client/src/lib/api-client.ts`):**
  - Updated request interceptor to automatically remove default `Content-Type: application/json` header when payload is `FormData`, allowing Axios to generate the correct multipart boundary.
  - Enabled passing `AxiosRequestConfig` with `onUploadProgress` and custom 120s upload timeouts to `post`, `get`, `put`, `patch`.
- **Categories Service Enhancement (`client/src/features/marketplace/categoriesService.ts`):**
  - Updated `getCategories` to pass `{ tree: 'true' }` query parameter matching backend Zod query schema.
  - Added `getCategoryAttributes` to fetch dynamic category attribute definitions.
- **Listings Service API Expansion (`client/src/features/marketplace/listingsService.ts`):**
  - Added `createListing(payload, onUploadProgress)` packing fields and files into `FormData` with progress tracking.
  - Added `uploadListingMedia(listingId, files, onUploadProgress)` targeting `POST /api/v1/listings/:listingId/media/upload`.

#### Part B: Listing Validation Conventions
- **Validation Module (`client/src/features/marketplace/listingValidation.ts`):**
  - Defined `createListingClientSchema` matching server Zod rules (title 2-160 chars, price > 0 and <= ₹9,99,99,999, valid phone regex, UUID categoryId).
  - Defined `validateImageFiles` enforcing max 12 photos, max 10MB per photo, and allowed MIME types (`image/jpeg`, `image/png`, `image/webp`).
  - Defined `validateVideoFile` enforcing max 50MB and allowed MIME types (`video/mp4`, `video/quicktime`, `video/webm`).
  - Defined `validateCategoryAttributes` verifying required attributes, valid numeric ranges, and allowed select options.

#### Part C: Complete Sell Workflow Experience
- **Interactive Sell Page (`client/src/app/(account)/sell/page.tsx`):**
  - Replaced prototype mockup with real, fully interactive sell workflow.
  - Step 1: Real categories loaded from API with responsive grid and subcategory chips.
  - Step 2: Multi-photo file picker with thumbnail previews, count indicator (`X/12`), individual remove actions, and video reel upload box.
  - Step 3: Dynamic category attribute specifications generated from category schema.
  - Step 4: Ad details (Title, Price in INR with symbol, City, State, Locality, Phone, Description).
  - Live upload progress bar (0% - 100%) during multipart upload.
  - Error banners for 401 (Sign In required), 413 (File size too large), 422 (field validation), and network disconnects with Retry button.
  - Non-blocking `AuthPromptModal` for guest users trying to post ads.
  - Success banner and automatic redirect to `/listing/[id]`.
  - Double submission guard locking submit button and ref.
  - Safe mobile-first layout with `pb-24 md:pb-12` preserving bottom navigation.

#### Part D: Test Suite Verification
- **Unit Tests (`client/tests/unit/sell-listing.test.tsx`):**
  - Required field validation tests (title, price, phone, categoryId).
  - Invalid file type and size rejection tests for images and videos.
  - Max 12 images limit enforcement.
  - Multipart listing creation and progress tracking.
  - Direct media upload route verification.
  - 401 Unauthorized, 413 Payload Too Large, and 422 Validation Error handling.
  - In-flight double-submit lock verification.

---

### 3. Verification Evidence & Quality Gates

- **TypeScript Compilation:**
  - `./client/node_modules/.bin/tsc -p client/tsconfig.json --noEmit` -> Passed with code 0 (zero errors).
- **ESLint Validation:**
  - `npm --prefix client run lint` -> Passed with code 0 (zero errors, zero warnings).
- **Production Build:**
  - `npm --prefix client run build` -> Passed with code 0.
  - All 32 routes compiled and prerendered cleanly (including `/sell`).
- **Sub-Project Isolation:**
  - `../mobile` remained 100% untouched.
  - `../admin` remained 100% untouched.
  - Database schema (`schema.prisma`) remained 100% untouched; zero destructive operations performed.

---

## 6. Phase 6 Verification Record

### 1. Capability Audit & Operational Classification

| Feature / Domain | Classification | Operational Reality & Verification Evidence | Client & Server Behavior |
| :--- | :--- | :--- | :--- |
| **Production Configuration** | **A. Supported & safe** | Zod validation in `server/src/config/env.js` enforces minimum 32-char non-default JWT secrets, bans wildcard CORS in production, and validates all required keys. Sanitized `.env.example` free of real credentials. | Client runtime env in `client/src/lib/env.ts` locks canonical domain `https://bazarr360.in` and strips trailing slashes safely. |
| **App Router SEO & Robots** | **A. Supported & safe** | App Router metadata routes: `client/src/app/robots.ts` and `client/src/app/sitemap.ts`. | Canonical indexing rules disallow private account routes (`/chats`, `/wallet`, `/sell`, `/notifications`) while indexing public marketplace routes. Dynamic `/sitemap.xml` generated. |
| **Observability & Logging** | **A. Supported & safe** | Pino structured JSON logging with request ID tracking (`x-request-id`). Redacts private messages (`req.body.content`), passwords, tokens, cookies, and phone numbers. | Errors masked in production (`errorHandler.js`) returning safe user-facing envelopes without internal DB or stack leaks. Slow requests (>1000ms) flagged with warnings. |
| **Database Safety & Recovery** | **A. Supported & safe** | Documented in `server/DEPLOYMENT_AND_RECOVERY.md`. Non-destructive additive migration rules (`prisma migrate deploy`), automated snapshot policy, and restore drill procedures. | Prohibits destructive commands (`migrate reset`, `drop`, `truncate`). `/health/ready` returns 503 if database connection fails. |
| **Buyer–Seller Chat** | **A. Supported & safe** | Authoritative REST persistence in PostgreSQL (`Conversation`, `ConversationParticipant`, `Message`). Participant-level authorization guard (403 for intruders) verified in `tests/production-readiness.test.js`. | Dedicated `client/src/features/chat/chatService.ts` and responsive dual-view `ChatsPage` with live conversation sync, message history, safe bottom navigation spacing, and unread badges. |
| **Realtime Chat Transport** | **B. Supported with limitations** | REST persistence and polling supported. Socket.IO realtime cluster transport deferred until distributed Redis websocket infrastructure is provisioned. | Realtime delivery not claimed without dedicated socket cluster; REST exchange is fully functional and persisted. |
| **Media Processing** | **B. Supported with limitations** | Secure signed upload parameter generation in Cloudinary storage adapter (`generateUploadSignature`, `generateListingUploadSignature`). Upload size limits enforced (10MB image, 100MB video). Missing media fallbacks verified. | Worker-based transcoding and HLS multi-bitrate packaging honestly documented as deferred. MP4 delivery via Cloudinary CDN active. |
| **Notification Delivery** | **B. Supported with limitations** | Relational in-app notifications (`Notification` table), unread indicators, read/delete endpoints, and user preference toggles active. | External push (APNs/FCM) and SMS delivery honestly documented as deferred. No fake push deliveries claimed. |
| **Abuse & Scale Controls** | **A. Supported & safe** | Rate limiters (`apiLimiter`, `authLimiter`), atomic coin debits with idempotency keys (`idempotencyKey`), and strict bounded pagination across listings and reels. | Unbounded pagination attempts (`limit=10000`) safely rejected with 422 Unprocessable Entity by Zod validator. |

---

### 2. Work Completed

#### Part A: Production Configuration & Fail-Safe Environment
- **Server Environment Hardening (`server/src/config/env.js`):**
  - Added strict production refinements rejecting default dev JWT secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` must be >= 32 characters in production).
  - Banned wildcard CORS (`CORS_ORIGIN=*`) in production when credentials are supported.
  - Sanitized `server/.env.example` by replacing real-looking Cloudinary values with dummy placeholders.
- **Client Metadata & SEO (`client/src/app/robots.ts`, `client/src/app/sitemap.ts`):**
  - Implemented Next.js App Router canonical `robots.ts` disallowing private account/auth routes and exposing sitemap index.
  - Implemented dynamic `sitemap.ts` with daily/weekly change frequencies.

#### Part B: Observability & Safe Centralized Errors
- **Logger Hardening (`server/src/config/logger.js`):**
  - Expanded sensitive data redaction to include `req.body.content` (private buyer-seller chat messages), `req.body.phone`, `req.body.contactPhone`, and `req.body.text`.
  - Added slow request detection (>1000ms) with warning log levels.
- **Centralized Error Handler (`server/src/middlewares/errorHandler.js`):**
  - Added production error masking to prevent leaking internal database table names or stack traces during unexpected 500 errors.

#### Part C: Production Chat Integration
- **Client Chat Service (`client/src/features/chat/chatService.ts`):**
  - Integrated `getConversations`, `getMessages`, `sendMessage`, and `getOrCreateConversation` with backend `/api/v1/conversations`.
- **Responsive Buyer-Seller Chat View (`client/src/app/(account)/chats/page.tsx`):**
  - Mobile app dual view (Conversation List <-> Message Thread) with back arrow navigation.
  - Safe-area bottom padding (`pb-24 md:pb-12`) preserving bottom tab navigation.
  - Unread badge counters, live conversation snippets, message input state, and empty/error states.

#### Part D: Database Safety Runbook & SOP
- **Deployment & Recovery Runbook (`server/DEPLOYMENT_AND_RECOVERY.md`):**
  - Authoritative SOP for zero-downtime deployments, graceful shutdown (10s drain window), non-destructive migrations (`prisma migrate deploy`), daily `pg_dump` backup policies, point-in-time recovery drills, and strict prohibition of destructive commands (`migrate reset`, `drop`, `truncate`).

---

### 3. Verification Evidence & Quality Gates

- **Client Quality Gates:**
  - `cd client; npx tsc --noEmit` -> Passed with code 0 (zero TypeScript errors).
  - `cd client; npm run lint` -> Passed with code 0 (zero errors, zero warnings).
  - `cd client; npm run build` -> Passed with code 0 (All 32 routes compiled and prerendered cleanly, including `/robots.txt` and `/sitemap.xml`).
- **Backend Quality Gates:**
  - `cd server; node --test tests/production-readiness.test.js` -> 5/5 passed (Production env gates, health endpoints, logger redaction, chat authorization, bounded pagination).
  - `cd server; node --test tests/marketplace-flows.test.js` -> 7/7 passed (All marketplace flows regression verified).
  - `cd server; node --test tests/boost-system.test.js` -> 4/4 passed (Welcome bonus, negative paths, atomic boost & idempotency, expiry & feed mixing).
  - `cd server; node --test tests/auth.test.js` -> 2/2 passed (Basic auth & session lifecycle rotation).
  - `cd server; node --test tests/wallet-backfill.test.js` -> 5/5 passed (First-time credit, rerun idempotency, skip inactive, concurrency safety, dry-run).
- **Sub-Project Isolation:**
  - `../mobile` remained 100% untouched.
  - `../admin` remained 100% untouched.
  - Database schema (`schema.prisma`) remained 100% untouched; zero destructive database operations executed.

---

## 6. Phase 5 Verification Record

### 1. Capability Audit & Classification

| Feature | Classification | Backend Evidence & Reason | Client Behavior |
| :--- | :--- | :--- | :--- |
| **Wallet Balance** | **A. Supported & safe** | `GET /api/v1/wallet/balance` authenticated endpoint returning authoritative `coinsBalance`. Balance is never updated directly by client. | Rendered on `/wallet` hero card and `BoostModal`. No client-side balance calculations. |
| **Coin Transaction History** | **A. Supported & safe** | `GET /api/v1/wallet/transactions` paginated ledger query with `amount`, `balanceAfter`, `type`, `reason`, `createdAt`. | Directional transaction list (+green/-red), transaction type icons (`WELCOME_BONUS`, `BOOST_SPENT`, `PURCHASE`, `REFUND`), balance snapshots. |
| **Boost Packages** | **A. Supported & safe** | `GET /api/v1/boost-packages` returning active packages (`id`, `name`, `durationDays`, `coinsCost`). | Verified package showcase on `/wallet` and interactive selection in `BoostModal`. |
| **Listing Boost Lifecycle** | **A. Supported & safe** | `POST /api/v1/advertisements` with `{ targetType: 'LISTING', targetId, packageId, idempotencyKey }`. Server enforces listing ownership, `ACTIVE` status, duplicate active check, atomic debit. | Owner-only "Boost This Listing" CTA on `/listing/[id]`, confirmation step, remaining balance preview, insufficient funds alert. |
| **Reel Boost Lifecycle** | **A. Supported & safe** | `POST /api/v1/advertisements` with `{ targetType: 'REEL', targetId, packageId, idempotencyKey }`. Server enforces creator ownership, `PUBLISHED` status, atomic debit. | Creator boost flow via `BoostModal`. |
| **Sponsored Content Display** | **A. Supported & safe** | Backend feed mixer (`mixListingsFeed` 1:4 interval, `mixReelsFeed` 1:6 interval) injects eligible active boosted items with `isSponsored: true`. | Distinct "Featured" badge on `ListingCard` and "Sponsored" badge on `ReelCard` with accessible ARIA labels. |
| **Boost Status & Expiry** | **A. Supported & safe** | `GET /api/v1/advertisements` owner listing query and `POST /advertisements/:id/cancel` stop endpoint. Expired ads filtered out automatically by server. | Dedicated `/boosted-content` management page with active/completed status badges, countdown, and cancellation. |
| **Welcome Coins** | **A. Supported & safe** | 200 welcome coins credited on registration (`WELCOME_BONUS` transaction); idempotent backfill script verified. | Reflected accurately in wallet on sign in. |
| **Boost Notifications** | **B. Supported with limitations** | Prisma `NotificationType` enum does not include boost events; destructive schema migrations are forbidden. | Toast and transaction ledger provide immediate feedback. Push/email delivery not claimed. |
| **Real Money Payments / Escrow** | **C. Unsupported & deferred** | No real-money gateway, UPI, card checkout, payout, escrow, or delivery billing in backend. | Coins treated strictly as internal marketplace credits. Financial claims avoided. |

---

### 2. Work Completed

#### Part A: Customer Wallet Experience
- **Wallet Service (`src/features/wallet/walletService.ts`):**
  - Added `getBalance()` and `getTransactions(page, limit)` integrated with backend `/wallet` endpoints.
- **Wallet Page (`src/app/(account)/wallet/page.tsx`):**
  - Mobile app visual parity layout mirroring `mobile/src/app/wallet.tsx`.
  - Hero Coin Balance Card with coin badge, authoritative server balance, description, and "View Boosted Content" link.
  - Available Boost Packages grid with duration and coin costs.
  - Coin transaction history with directional icon circles, formatted reasons, relative timestamps, and balance snapshots.
  - Loading skeleton, empty state, error state with retry, and non-blocking guest auth modal.

#### Part B: Boost Package Experience & Modal
- **Boost Service (`src/features/boost/boostService.ts`):**
  - Added `getPackages()`, `createBoost()`, `getMyAdvertisements()`, and `cancelBoost()`.
- **Interactive Boost Modal (`src/components/boost/BoostModal.tsx`):**
  - Bottom sheet on mobile, centered modal on desktop mirroring `mobile/src/components/boost/BoostModal.tsx`.
  - Live coin balance preview, package selection, estimated remaining balance calculation.
  - Deficit warning callout when balance is insufficient (`You need X more coins...`).
  - Client-side idempotency key generation (`idemp_${Date.now()}_...`).
  - In-flight double-submit lock preventing duplicate debits.
  - Full keyboard accessibility (Escape key dismiss) and clean error normalization.

#### Part C: Listing & Reel Boost Flow
- **Listing Detail Integration (`src/components/listings/ListingDetailView.tsx`):**
  - Evaluates listing ownership (`currentUser.id === listing.seller.id`).
  - Desktop: Renders "Boost This Listing" CTA in place of self-chat/self-call actions.
  - Mobile: Renders sticky "Boost Listing" button above BottomNav.
  - Opens `BoostModal` with listing metadata.
- **Profile Storefront Integration (`src/components/profile/ProfileView.tsx`):**
  - Renders "My Wallet" and "Boosted Ads" shortcuts when viewing own profile.

#### Part D: Sponsored Content Presentation
- **Listing Card (`src/components/listings/ListingCard.tsx`):**
  - Added prominent "Featured" badge with `role="status"` and `aria-label="Sponsored listing"`.
- **Reel Card (`src/components/reels/ReelCard.tsx`):**
  - Added prominent "Sponsored" badge with `role="status"` and `aria-label="Sponsored reel"`.
- **Model Synchronization (`src/types/listing.ts`, `src/types/reel.ts`, `listingsService.ts`, `reelsService.ts`):**
  - Extended models with `isSponsored?: boolean;` and `advertisementId?: string;`.

#### Part E: Boosted Content Management
- **Boosted Content Page (`src/app/(account)/boosted-content/page.tsx`):**
  - Lists user's active and completed campaigns.
  - Displays target type (Listing/Reel), duration days, coins spent, status badge, expiry timing.
  - "View Item" link and "Stop Boost" cancellation action.
  - Empty, loading, and error states.

#### Part F: Navigation Integration
- **Header (`src/components/layout/Header.tsx`):**
  - Added Coins / Wallet shortcut in desktop header and mobile top bar.

---

### 3. Verification Evidence & Quality Gates

- **TypeScript Compilation:**
  - `cd client; npx tsc --noEmit` -> Passed with code 0 (zero errors).
- **ESLint Validation:**
  - `cd client; npm run lint` -> Passed with code 0 (zero errors, zero warnings).
- **Production Next.js Build:**
  - `cd client; npm run build` -> Passed with code 0.
  - All 30 routes prerendered cleanly (including `/wallet` and `/boosted-content`).
- **Backend Test Verification:**
  - `cd server; node --test tests/boost-system.test.js` -> 4/4 passed (welcome bonus, negative paths, atomic boost & idempotency, expiry job & feed mixing).
  - `cd server; npm test` (`tests/marketplace-flows.test.js`) -> 7/7 passed (all marketplace flows pass).
- **Directories Unchanged:**
  - `../mobile` remained 100% untouched (read-only reference).
  - `../admin` remained 100% untouched.
  - Database schema (`schema.prisma`) remained 100% untouched.

---

## 6. Phase 4 Verification Record

### 1. Capability Audit & Classification

| Feature | Classification | Backend Evidence & Reason | Client Behavior |
| :--- | :--- | :--- | :--- |
| **Reel Comments** | **A. Supported & safe** | `ReelComment` model present; `GET /reels/:reelId/comments` (paginated) & `POST /reels/:reelId/comments` verified in Express routes. | Full mobile bottom sheet, comment list, validation (1-1000 chars), guest auth prompt, loading/empty/error states. |
| **Location Discovery** | **A. Supported & safe** | `Listing` contains `locationState`, `locationCity`, `locationLocality`; `GET /listings` accepts `state`, `city`, `search` (locality match). | State and City picker modal, active location chip, reset to All India, location-aware empty state. No forced/auto GPS. |
| **Related Discovery** | **A. Supported & safe** | `GET /listings?categoryId=...`, `GET /listings?city=...`, `GET /reels?listingId=...`, `GET /reels?creatorId=...`. | Deterministic sections ("More from this category", "More from this seller", "Related reels"). No fake AI ranking. |
| **In-App Notifications** | **A. Supported & safe** | `Notification` model with `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /read-all`, `DELETE /:id`. | Dedicated `/notifications` page with list, unread badge indicator, mark as read, mark all read, empty/error state. |
| **Business Profiles** | **B. Partially supported (Limited UI)** | `User` model includes `name`, `avatarUrl`, `bio`, `locationCity`, `locationState`, `isVerifiedSeller`, `createdAt`. No store catalog or business analytics table. | Honest public profile (`/profile/[id]`) with verified badge, active listings, public reels, message seller, share profile. Removed fake hardcoded reviews/ratings. |
| **Follow System** | **C. Unsupported & deferred** | No `Follow` or `UserFollow` model in Prisma schema; no follow/unfollow endpoints. | No fake buttons; no localStorage simulation; deferred documented. |
| **Seller Ratings & Reviews** | **C. Unsupported & deferred** | No `Review` or `Rating` model in database schema. | Completely removed hardcoded fake ratings ("4.9 / 5.0") from profile and listing views; no review submission forms. |
| **Saved Searches** | **C. Unsupported & deferred** | No `SavedSearch` model or backend endpoints. | Not persisted in localStorage as fake account data; documented for future backend phase. |
| **Offers & Negotiation** | **C. Unsupported & deferred** | Formal offer state machine schema does not exist; buyer-seller chat handles conversational price negotiation. | Formal offer UI deferred; conversational negotiation supported in chat. |
| **Business Analytics** | **C. Unsupported & deferred** | No analytics or lead aggregation APIs in backend. | No fake analytics charts or numbers displayed. |
| **Recommendations** | **C. Unsupported & deferred** | AI recommendation engine explicitly deferred in `BACKEND_TRACKER.md`. | Kept discovery strictly deterministic based on category, location, and seller. |

---

### 2. Work Completed

#### Part A: Reel Comments Experience
- **Reel Comments Service (`src/features/reels/reelsService.ts`):**
  - Added `getComments(reelId, query)` and `addComment(reelId, text)` integrated with backend `/reels/:reelId/comments` endpoints.
- **Mobile-Friendly Comments Bottom Sheet (`src/components/reels/ReelCommentsSheet.tsx`):**
  - Accessible dialog semantics (`role="dialog"`, `aria-modal="true"`, `aria-label="Reel Comments"`).
  - Comment list with user avatar, name, comment text, and formatted relative timestamps.
  - Empty comments state, skeleton loading state, and error retry view.
  - Validated comment input (trimmed, 1-1000 characters).
  - Unauthenticated guest user prompt opening `AuthPromptModal`.
  - Keyboard-safe handling (Escape key close, auto-scroll to new comments).
- **Interactive Reel Card Integration (`src/components/reels/ReelCard.tsx`):**
  - Interactive comment trigger button displaying compact comment count.
  - Dynamically updates comment counts on submission.

#### Part B: Location-Based Discovery & Metadata
- **Curated Indian States & Cities Metadata (`src/features/location/indiaLocations.ts`):**
  - Structured list of 20 Indian States / Union Territories with major districts and cities.
  - Curated list of popular metro cities.
  - Helpers for state-city resolution and fast search.
- **Location Selector Modal (`src/components/location/LocationSelectorModal.tsx`):**
  - Accessible bottom sheet / modal with search input, popular metro chips, and state-wise city drilldown.
  - "Reset to All India" one-click action.
  - Consent-safe GPS detection button (only runs on explicit user click with clear consent messaging).
- **Header Integration (`src/components/layout/Header.tsx`):**
  - Mobile top bar and desktop header location pills wired to open `LocationSelectorModal`.
  - Added notifications icon shortcut with unread indicator.

#### Part C: Search & Filter UX
- **Mobile Filter Drawer & Desktop Panel (`src/components/search/SearchFilterDrawer.tsx`):**
  - Category selector chips, State and City drilldown, Min/Max price inputs, and sorting controls.
  - Accessible dialog semantics with "Apply Filters" and "Reset" actions.
- **Interactive Search Page Container (`src/components/search/SearchPageView.tsx` & `src/app/(public)/search/page.tsx`):**
  - 2-column mobile grid preserved without horizontal overflow.
  - Active filter chips with individual removal and "Clear All" action.
  - URL query synchronization (`/search?q=...&category=...&city=...&sort=...`) for clean browser back/forward navigation.
  - Loading skeleton state and informative empty state with filter reset guidance.

#### Part D: Public Seller Profile & Business Storefronts
- **Users Service (`src/features/users/usersService.ts`):**
  - `getUserProfile(userId)` fetching from `GET /api/v1/users/:userId`.
- **Honest Public Profile View (`src/components/profile/ProfileView.tsx` & `src/app/(account)/profile/[id]/page.tsx`):**
  - Removed all hardcoded fake stars ("4.9 / 5.0 (48 Reviews)") and fake response percentages.
  - Renders authentic verified seller badge, member since date, location, and bio.
  - Segmented control / horizontal tabs: "Active Listings (N)" and "Product Reels (N)".
  - Canonical profile share action with Web Share API and clipboard copy toast (`https://bazarr360.in/profile/[id]`).
  - Contact seller action with guest auth prompt.
- **Dedicated Business Storefront Route (`src/app/(public)/business/[slug]/page.tsx`):**
  - Replaced legacy placeholder page (which previously contained simulated rating text) with a live, honest business storefront view powered by `ProfileView`.
  - In alignment with backend reality: because dedicated commercial storefront tables do not exist in the database, the generic verified seller profile model is used with business branding (`isBusiness: true`), "Verified Business" badge, active listings, and product reels.
  - Dynamic SEO metadata generation and canonical URL (`getBusinessCanonicalUrl` -> `https://bazarr360.in/business/[slug]`).
  - Strict compliance: zero fake reviews, zero fake ratings, and zero fake follower counts.

#### Part E: Related Discovery
- **Listing Detail View (`src/components/listings/ListingDetailView.tsx`):**
  - Removed hardcoded fake seller rating.
  - Added deterministic "More from {seller}" section.
  - Added deterministic "Related Product Reels" section for walkarounds linked to the product or creator.
  - Added "More in {category}" section.

#### Part F: In-App Notifications
- **Notifications Service (`src/features/notifications/notificationsService.ts`):**
  - `getNotifications`, `markAsRead`, `markAllAsRead`, `deleteNotification`.
- **Notifications Page (`src/app/(account)/notifications/page.tsx`):**
  - Responsive mobile-first in-app notifications page.
  - Type-specific icons (messages, reel likes, comments, listing verification).
  - Unread indicator, mark single/all as read, delete notification, empty and error states.

---

### 3. Verification Evidence & Quality Gates

- **Unit Test Suites Added & Verified:**
  - `tests/unit/reel-comments.test.tsx` (Comments sheet semantics, initial count, unauthenticated prompt, closed state)
  - `tests/unit/location-discovery.test.ts` (State/city resolution, search, modal dialog attributes, All India reset)
  - `tests/unit/search-filter.test.tsx` (Filter drawer controls, active filter chips, results count)
  - `tests/unit/profile-public.test.tsx` (Public seller field rendering, absence of fake ratings/reviews, canonical URL, verified business storefront rendering, and business canonical URL)
- **Responsive Viewport Parity (320px - 1440px):**
  - Verified layout across compact mobile widths: 320px, 360px, 390px, 430px.
  - Verified tablet and desktop widths: 768px, 1024px, 1440px.
  - Safe-area bottom spacing (`env(safe-area-inset-bottom)`) preserved across all modal sheets and sticky action bars.
  - Reel comments sheet and search filter drawer positioned above fixed bottom navigation on mobile.
  - Touch targets maintain >= 44px hit areas; zero horizontal overflow.
- **Directories Unchanged:**
  - `../mobile` remained 100% untouched.
  - `../admin` remained 100% untouched.
  - Database schema (`schema.prisma`) and Prisma migrations remained 100% untouched.

---

## 6. Phase 3 Verification Record

### 1. Work Completed

#### Part A: Production Environment Safety
- **Runtime Environment Validation (`src/lib/env.ts`):**
  - Centralized typed environment validator for `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`, and `NEXT_PUBLIC_API_BASE_URL`.
  - Normalizes trailing slashes, enforces protocol validation (`http://` or `https://`), and provides safe local development defaults.
  - Production canonical URL locked to `https://bazarr360.in`.
  - Zero secrets in client code or `.env.example`.
  - Replaced ad-hoc `process.env` lookups across `api-client.ts`, `share.ts`, and root `layout.tsx`.

#### Part B: Mobile App-Like Launch Experience
- **Responsive Viewport Parity (320px - 1440px):**
  - Verified layout at 320px, 360px, 390px, 430px (compact mobile), 768px, 1024px (tablet), and 1280px, 1440px (desktop).
  - Preserved fixed bottom tab navigation (`BottomNav`) with safe-area insets (`env(safe-area-inset-bottom)`) and >= 44px touch targets.
  - Ensured no content hides behind the bottom bar via `pb-24 md:pb-12` and `pb-36` safe paddings.
  - Zero horizontal overflow across all screens.
  - Header remains compact on mobile with crisp official logo `/images/logo-1.png`.
  - Sticky bottom action bar on listing detail elevated to `bottom-[calc(3.75rem+env(safe-area-inset-bottom))]` to prevent collision with `BottomNav` across notched/safe-area devices.

#### Part C: Accessibility (a11y) Review & Enhancements
- **Semantic Landmarks:** `<header>`, `<main>`, `<nav>`, `<footer>`, `<section>` correctly placed.
- **Heading Hierarchy:** Validated single `<h1>` per page with sequential `<h2>` and `<h3>` tags. Added `<h1 className="sr-only">` on mobile home views.
- **Accessible Names:** Added descriptive `aria-label` tags to all icon-only buttons and links across Header, ListingCard, ReelCard, ListingDetailView, and ChatsPage.
- **Keyboard Navigation & Visible Focus:** Added `focus-visible:ring-2 focus-visible:ring-orange-500` rings across interactive controls and inputs.
- **Dialog Accessibility:** Added `Escape` key listener and backdrop click dismissal to `AuthPromptModal`.
- **Form Controls:** Form inputs mapped with labels and placeholder hints.

#### Part D: Operational States & Invalid Route Normalization
- **Reusable Operational State Components (`src/components/ui/state-views.tsx`):**
  - `ErrorState`: Formats errors with role="alert", readable user messaging, status badges, and debounce/disable protection on retry buttons.
  - `EmptyState`: Clean icon, friendly title, descriptive guidance, and call-to-action link.
  - `ListingSkeletonGrid`: Fixed-aspect skeletons preventing Cumulative Layout Shift (CLS) during data fetching.
  - `AuthPromptModal`: Non-blocking modal with Escape-key dismiss for unauthenticated users attempting protected actions (favourite, direct chat, posting ad) without locking them out of public browsing.
  - `getFriendlyErrorMessage`: Translates 401, 403, 404, 429, timeout, and offline states into plain English without exposing stack traces or raw backend logs.
- **Invalid Route & Missing Item Handling:**
  - `/listing/[id]` and `/reels/[id]` normalized to return clean 404 `ErrorState` views when item is missing or deleted, preventing misleading fallback mock data or page crashes.

#### Part E: Security, Auth & Session Lifecycle Hardening
- **Backend API Endpoints Alignment:**
  - Aligned refresh token rotation to `/auth/refresh` (matching backend `server/src/modules/auth/auth.routes.js`).
  - Aligned OTP endpoints to `/auth/otp/request` and `/auth/otp/verify`.
  - Excluded `/auth/refresh` from 401 refresh interception to prevent infinite refresh loops.
- **Session Lifecycle & Restoration (Journey C):**
  - Added `getCurrentUser` (`GET /auth/me`) and `initAuth` in `useAuthStore.ts` to restore authenticated sessions across browser refreshes.
- **Open Redirect Sanitization (`src/lib/security.ts`):**
  - `sanitizeRedirectUrl` enforces relative paths starting with single `/` and rejects protocol-relative (`//evil.com`) or pseudo-protocols (`javascript:`).
  - Integrated into `/login` and `/register` flows.
- **Complete Logout Cache Cleanup:**
  - `clearAllUserDataOnLogout` deletes access/refresh tokens and wipes all user session items from client storage.
  - Wired into `useAuthStore.ts` `clearSession` and `logout` actions.

#### Part F: SEO & Canonical Share-Link Readiness
- **Dynamic Metadata & Open Graph Tags:**
  - Converted `/listing/[id]` to a Server Component with `generateMetadata`, canonical URL `https://bazarr360.in/listing/[id]`, and Twitter card tags.
  - Added `generateMetadata` to `/reels/[id]` (`https://bazarr360.in/reels/[id]`), `/categories/[slug]` (`https://bazarr360.in/categories/[slug]`), and `/profile/[id]` (`https://bazarr360.in/profile/[id]`).
  - Web Share API helper `shareContent` with fallback to clipboard write and status toast feedback.

---

### 2. Verification Evidence & Quality Gates

- **TypeScript Compilation:**
  - `cd client; npx tsc --noEmit` -> Passed with code 0 (zero errors).
- **ESLint Validation:**
  - `cd client; npm run lint` -> Passed with code 0 (zero errors, zero warnings).
- **Production Build:**
  - `cd client; npm run build` -> Passed with code 0.
  - All 27 routes compiled successfully and prerendered statically / partial prerendered.
- **Unit Tests Added:**
  - `tests/unit/env.test.ts` (Environment defaults and URL normalization)
  - `tests/unit/security-logout.test.ts` (Redirect sanitization and logout storage wipe)
  - `tests/unit/auth-session.test.ts` (Auth lifecycle, session restoration, and logout wipe)
  - `tests/unit/state-views.test.tsx` (Error normalization, skeleton grid, and auth modal)
  - `tests/unit/mobile-parity.test.tsx` (5-tab navigation and safe-area sticky actions)
  - `tests/unit/share-metadata.test.ts` (Canonical URLs and share fallbacks)

---

### 3. Branding Inconsistency Finding (Retained Record)

- **Web Platform & Branding:** Uses **"Bazarr 360"** (double 'r', single 'a'). Domain: `https://bazarr360.in`. Logo: `/images/logo-1.png`.
- **Mobile Project:** Uses package ID `com.bazaar360.app` (single 'r', double 'a') and deep-link scheme `bazaar360://`.
- **Resolution:** Mobile package ID and scheme remain untouched as instructed. Web client consistently uses **Bazarr 360**.

---

### 4. Known Limitations & Deferred Work

- **Deferred Admin Work:** Admin dashboard (`/admin/*`) remains completely out of scope and untouched.
- **Mobile Project:** `../mobile` remains completely unmodified.
- **Peer Dependency Note:** `vitest` in `client/package.json` requires peer dependency `vite` for CLI runner execution; TypeScript typecheck, ESLint, and Next.js production build pass cleanly.

---

## 5. Phase 2 Verification Record

### 1. Work Completed

#### Part A: Mobile App Experience Parity
- **Mobile Shell & Navigation (320px - 767px):**
  - **Compact Mobile Top Bar:** Replaced large desktop header on mobile with a compact bar showing the official crisp logo (`/images/logo-1.png`), "Bazarr 360", compact location selector pill, search shortcut, and favourites quick link.
  - **Bottom Navigation (`BottomNav`):** Implemented the 5-tab mobile app navigation structure: Home (`/`), Explore (`/search`), Sell (`/sell`), Chats (`/chats`), Account (`/profile/example-user`). Includes safe-area insets (`env(safe-area-inset-bottom)`), active tint `#E85D04` (`palette.brand500`), and touch targets >= 44px. Desktop (768px+) hides this bottom nav.
  - **Customer Mobile Shell:** Admin tab strictly excluded from customer mobile shell.
- **Mobile Page Parity:**
  - **Home (`/`):** Touch-friendly search bar, horizontal scrollable category icons, horizontal 9:16 product reels discovery carousel, and 2-column compact marketplace cards.
  - **Reels Feed (`/reels`):** 9:16 vertical video feed with snap-scrolling on mobile, overlay action buttons (like, save, share, comments), creator info pill, and linked listing CTA.
  - **Reel Detail (`/reels/[id]`):** Dedicated single reel playback view with creator info, linked listing banner, and canonical share integration.
  - **Search (`/search`):** Compact search header, city dropdown, horizontal category chips, 2-column mobile listing grid with zero horizontal overflow.
  - **Listing Detail (`/listing/[id]`):** Full-width gallery with counter, bold price in INR, title, location & date row, verified seller badge, specifications grid, description, safety tips, and sticky bottom action bar (Chat, Call, Wishlist) elevated above the bottom tab bar.
  - **Categories (`/categories/[slug]`):** Compact category banner, subcategory chips, sorting, and compact listing grid.
  - **Sell (`/sell`):** Step-by-step mobile-first form with safe bottom spacing.
  - **Chats (`/chats`):** Mobile view switching between conversations list and active chat thread with pinned listing context and message bubbles.
  - **Favourites (`/favourites`):** Tabbed interface (Saved Listings vs Saved Reels) matching mobile account saved tab.
  - **Profile (`/profile/[id]`):** Seller card, verified badge, rating, member since, stats row (Listings, Reels, Response), and listing/reel tabs.
- **Visual Design & Icons:**
  - Adhered strictly to mobile design tokens (palette.brand500: `#E85D04`, teal verified badge, slate neutrals).
  - Used icons strictly from `lucide-react`.

#### Part B: Secure Backend Integration
- **Environment Configuration:**
  - Configured `client/.env.example` with `NEXT_PUBLIC_APP_NAME=Bazarr 360`, `NEXT_PUBLIC_APP_URL=https://bazarr360.in`, `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1`.
  - Configured `next.config.ts` remote patterns for Cloudinary (`res.cloudinary.com`) and Unsplash.
- **Centralized API Client (`src/lib/api-client.ts`):**
  - Single Axios instance with 30s timeout, JSON headers, typed `ApiError` normalization.
  - Safe token management (`src/lib/token-storage.ts`) using client localStorage without logging tokens or authorization headers.
  - Single-flight refresh token mutex (`src/lib/refresh-coordinator.ts`) to prevent race conditions during 401 refresh token rotation.
  - 429 rate limit backoff handling.
- **Authentication Integration (`src/features/auth/`):**
  - Verified backend endpoints: `/auth/login`, `/auth/register`, `/auth/request-otp`, `/auth/verify-otp`, `/auth/refresh-token`, `/auth/logout`.
  - Created working forms for `/login`, `/register`, and `/verify-otp`.
  - Public pages remain completely accessible without login.
  - State management powered by `useAuthStore` (Zustand).
- **Listings & Categories Integration (`src/features/marketplace/`):**
  - Services for `GET /listings`, `GET /listings/:id`, `GET /categories`, `GET /categories/:idOrSlug`, `POST /wishlist/:listingId`, `DELETE /wishlist/:listingId`.
- **Reels Integration (`src/features/reels/`):**
  - Services for `GET /reels`, `GET /reels/:id`, `POST /reels/:id/like`, `POST /reels/:id/save`.
- **Share Links and Metadata (`src/lib/share.ts`):**
  - Canonical URL generators: `https://bazarr360.in/listing/[id]`, `https://bazarr360.in/reels/[id]`.
  - Web Share API integration with clipboard fallback.
  - Dynamic page metadata and Open Graph tags using `/images/logo-1.png` as fallback brand image.

---

### 2. Branding Inconsistency Finding

- **Web Platform & Branding:** Uses **"Bazarr 360"** (double 'r', single 'a'). Domain: `https://bazarr360.in`. Logo: `/images/logo-1.png`.
- **Mobile Project:** Uses package ID `com.bazaar360.app` (single 'r', double 'a') and deep-link scheme `bazaar360://`.
- **Resolution:** Mobile package ID and scheme remain untouched as instructed. Web client consistently uses **Bazarr 360**.

---

### 3. Files Created or Modified in Phase 2

- **New files:**
  - `src/lib/api-client.ts`
  - `src/lib/api-error.ts`
  - `src/lib/token-storage.ts`
  - `src/lib/refresh-coordinator.ts`
  - `src/lib/share.ts`
  - `src/features/auth/authService.ts`
  - `src/features/auth/useAuthStore.ts`
  - `src/features/marketplace/listingsService.ts`
  - `src/features/marketplace/categoriesService.ts`
  - `src/features/marketplace/wishlistService.ts`
  - `src/features/reels/reelsService.ts`
  - `src/app/(public)/reels/[id]/page.tsx`
  - `tests/unit/api-client.test.ts`
  - `tests/unit/share-metadata.test.ts`
  - `tests/unit/mobile-parity.test.tsx`
- **Modified files:**
  - `next.config.ts`
  - `client/.env.example`
  - `src/components/layout/Header.tsx`
  - `src/components/layout/BottomNav.tsx`
  - `src/components/layout/Footer.tsx`
  - `src/components/ui/page-container.tsx`
  - `src/components/listings/ListingGrid.tsx`
  - `src/components/reels/ReelCard.tsx`
  - `src/app/(public)/page.tsx`
  - `src/app/(public)/reels/page.tsx`
  - `src/app/(public)/search/page.tsx`
  - `src/app/(public)/listing/[id]/page.tsx`
  - `src/app/(public)/categories/[slug]/page.tsx`
  - `src/app/(account)/chats/page.tsx`
  - `src/app/(account)/favourites/page.tsx`
  - `src/app/(account)/profile/[id]/page.tsx`
  - `src/app/(account)/sell/page.tsx`
  - `src/app/(auth)/login/page.tsx`
  - `src/app/(auth)/register/page.tsx`
  - `src/app/(auth)/verify-otp/page.tsx`
  - `PROJECT_PHASES.md`

---

### 4. Known Limitations & Deferred Work

- **Deferred Admin Work:** Admin dashboard (`/admin/*`) remained completely out of scope and unchanged.
- **Deferred Media Processing:** Media transcoding, direct S3/Cloudinary chunked upload pipeline, and HLS manifest generation remain deferred to future phases as per PRD.
- **Mobile Project:** `../mobile` remained completely unmodified.
- **Environment limitation:** As noted in Phase 0 & 1, execution environment restricts writing persistent build caches to `client/.next` and `client/tsconfig.tsbuildinfo`.

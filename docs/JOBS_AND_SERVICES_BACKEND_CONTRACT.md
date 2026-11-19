# Jobs & Services Backend Architecture & API Contract Specification

**Document Version:** 1.0.0  
**Phase:** 1 Review & Phase 2 Roadmap  
**Target Applications:** `server`, `client`, `mobile`  
**Status:** Deferred Feature Specification (No fake/mock data in production)

---

## 1. Executive Summary & Audit Findings

During the Phase 1 capability audit of the Bazarr 360 backend, the following architectural conditions were identified:

1. **Generic Classifieds Model Only (`Listing`):**
   - The current database schema (`server/prisma/schema.prisma`) provides a single `Listing` model designed for physical goods (title, price, currency, description, location, contact phone, media assets).
   - There are **no dedicated tables or relational structures** for employers, job applications, candidate resumes, service bookings, quote requests, or service reviews.

2. **Attribute Schema vs. Querying Disconnect:**
   - While `server/prisma/seed.js` seeds attribute definitions for `Jobs` (`jobType`, `salaryMin`, `salaryMax`, `experience`, `qualification`) and `Services` (`serviceType`, `availability`), the server listing query validator (`publicListingsQuerySchema` in `listings.validation.js`) and repository (`listings.repository.js`) **do not support dynamic attribute querying or filtering**.
   - Filtering by parent category ID does not recursively resolve child categories.

3. **Missing Business Workflows:**
   - **Jobs:** Missing applicant tracking (ATS), resume uploads, privacy-preserving candidate contact, recruiter verification, and salary range validations.
   - **Services:** Missing service area radiuses, hourly/fixed rate models, customer quote requests, appointment scheduling, and verified client testimonials.

4. **Product Decision:**
   - Strictly adhering to platform integrity principles: **Zero fake jobs, zero fake services, zero simulated ratings, and zero dummy application forms.**
   - The frontend routes `/jobs` and `/services` present an honest, polished deferred-feature state while directing active classified buyers/sellers to `/search` and `/sell`.
   - This document defines the required future schema and API contracts needed before full production enablement.

---

## 2. Target Database Models (Prisma Schema Extensions)

When backend support is developed in Phase 2, the following Prisma models must be added to `server/prisma/schema.prisma`:

```prisma
// ── Jobs Module ─────────────────────────────────────────────

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
  DAILY_WAGE
}

enum ExperienceLevel {
  FRESHER
  ONE_TO_TWO_YEARS
  THREE_TO_FIVE_YEARS
  FIVE_PLUS_YEARS
}

enum ApplicationStatus {
  SUBMITTED
  REVIEWED
  SHORTLISTED
  REJECTED
  HIRED
}

model JobListing {
  id               String          @id @default(uuid())
  ownerId          String
  owner            User            @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  categoryId       String
  category         Category        @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  
  title            String          @db.VarChar(160)
  companyName      String          @db.VarChar(120)
  jobType          JobType
  experienceLevel  ExperienceLevel
  minQualification String?         @db.VarChar(100)
  
  salaryMin        Decimal?        @db.Decimal(10, 2)
  salaryMax        Decimal?        @db.Decimal(10, 2)
  salaryPeriod     String          @default("MONTHLY") // MONTHLY, HOURLY, ANNUAL, DAILY
  currency         String          @default("INR") @db.VarChar(3)
  
  description      String          @db.Text
  requirements     String?         @db.Text
  benefits         String?         @db.Text
  vacanciesCount   Int             @default(1)
  
  locationState    String?
  locationCity     String?
  locationLocality String?
  latitude         Float?
  longitude        Float?
  
  contactPhone     String
  contactEmail     String?
  isVerifiedEmployer Boolean       @default(false)
  isActive         Boolean         @default(true)
  expiresAt        DateTime?
  
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  
  applications     JobApplication[]

  @@index([categoryId, isActive, createdAt(sort: Desc)])
  @@index([locationState, locationCity, isActive])
  @@index([jobType, experienceLevel])
  @@index([salaryMin, salaryMax])
}

model JobApplication {
  id              String            @id @default(uuid())
  jobId           String
  job             JobListing        @relation(fields: [jobId], references: [id], onDelete: Cascade)
  candidateId     String
  candidate       User              @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  
  coverNote       String?           @db.Text
  resumeStorageKey String
  resumeUrl       String
  contactPhone    String
  contactEmail    String
  status          ApplicationStatus @default(SUBMITTED)
  employerNotes   String?           @db.Text
  
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@unique([jobId, candidateId])
  @@index([candidateId, createdAt(sort: Desc)])
  @@index([jobId, status])
}

// ── Services Module ─────────────────────────────────────────

enum ServicePricingModel {
  FIXED_PRICE
  HOURLY_RATE
  STARTING_AT
  FREE_ESTIMATE
}

enum ServiceAvailabilityType {
  ON_DEMAND
  WORKING_HOURS
  TWENTY_FOUR_BY_SEVEN
  BY_APPOINTMENT
}

enum BookingStatus {
  REQUESTED
  ACCEPTED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model ServiceListing {
  id               String                  @id @default(uuid())
  providerId       String
  provider         User                    @relation(fields: [providerId], references: [id], onDelete: Cascade)
  categoryId       String
  category         Category                @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  
  title            String                  @db.VarChar(160)
  businessName     String?                 @db.VarChar(120)
  pricingModel     ServicePricingModel     @default(FREE_ESTIMATE)
  price            Decimal?                @db.Decimal(10, 2)
  currency         String                  @default("INR") @db.VarChar(3)
  
  availability     ServiceAvailabilityType @default(WORKING_HOURS)
  serviceRadiusKm  Int                     @default(25)
  yearsOfExperience Int?                   @default(1)
  
  description      String                  @db.Text
  skillsAndServices String[]               @default([])
  
  locationState    String?
  locationCity     String?
  locationLocality String?
  latitude         Float?
  longitude        Float?
  
  contactPhone     String
  isVerifiedProvider Boolean               @default(false)
  isActive         Boolean                 @default(true)
  
  createdAt        DateTime                @default(now())
  updatedAt        DateTime                @updatedAt
  
  bookings         ServiceBooking[]
  reviews          ServiceReview[]

  @@index([categoryId, isActive, createdAt(sort: Desc)])
  @@index([locationState, locationCity, isActive])
  @@index([latitude, longitude])
  @@index([pricingModel])
}

model ServiceBooking {
  id              String          @id @default(uuid())
  serviceId       String
  service         ServiceListing  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  customerId      String
  customer        User            @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  requestedDate   DateTime
  serviceAddress  String
  problemDetails  String          @db.Text
  quotedAmount    Decimal?        @db.Decimal(10, 2)
  status          BookingStatus   @default(REQUESTED)
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([serviceId, status])
  @@index([customerId, createdAt(sort: Desc)])
}

model ServiceReview {
  id              String          @id @default(uuid())
  serviceId       String
  service         ServiceListing  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  customerId      String
  customer        User            @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  rating          Int             // 1 to 5
  reviewText      String?         @db.Text
  createdAt       DateTime        @default(now())

  @@unique([serviceId, customerId])
  @@index([serviceId, rating])
}
```

---

## 3. Required REST API Endpoints

### 3.1 Jobs Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/jobs` | Search & filter jobs with pagination | Optional |
| `GET` | `/api/v1/jobs/:id` | Get job details and employer info | Optional |
| `POST` | `/api/v1/jobs` | Post a job opening | Yes (Verified Employer/User) |
| `PATCH` | `/api/v1/jobs/:id` | Update job opening | Yes (Owner/Admin) |
| `DELETE` | `/api/v1/jobs/:id` | Deactivate/archive job | Yes (Owner/Admin) |
| `POST` | `/api/v1/jobs/:id/apply` | Submit application with resume upload | Yes (Candidate) |
| `GET` | `/api/v1/jobs/:id/applications`| List applicants for owned job | Yes (Owner) |
| `PATCH` | `/api/v1/jobs/applications/:appId/status` | Update applicant status (Shortlist/Reject) | Yes (Owner) |
| `GET` | `/api/v1/jobs/my-applications` | Candidate's submitted job applications | Yes (Candidate) |

#### Query Parameters for `GET /api/v1/jobs`
```typescript
interface JobsQueryParams {
  search?: string;             // Keywords across title, description, skills
  jobType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'DAILY_WAGE';
  experienceLevel?: 'FRESHER' | 'ONE_TO_TWO_YEARS' | 'THREE_TO_FIVE_YEARS' | 'FIVE_PLUS_YEARS';
  salaryMin?: number;
  salaryMax?: number;
  city?: string;
  state?: string;
  subcategoryId?: string;
  page?: number;               // Default: 1
  limit?: number;              // Default: 20, max: 50
  sortBy?: 'newest' | 'salary_desc' | 'salary_asc';
}
```

### 3.2 Services Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/services` | Search & filter local service providers | Optional |
| `GET` | `/api/v1/services/:id` | Get provider profile, offerings & reviews | Optional |
| `POST` | `/api/v1/services` | Register a service provider profile | Yes (User) |
| `PATCH` | `/api/v1/services/:id` | Update service profile | Yes (Owner) |
| `POST` | `/api/v1/services/:id/request-quote` | Request an inspection/quote/booking | Yes (Customer) |
| `GET` | `/api/v1/services/:id/reviews` | List customer reviews for provider | Optional |
| `POST` | `/api/v1/services/:id/reviews` | Post verified review after service | Yes (Verified Customer) |

#### Query Parameters for `GET /api/v1/services`
```typescript
interface ServicesQueryParams {
  search?: string;
  subcategoryId?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;           // Geospatial radius filter (e.g. 10km, 25km)
  pricingModel?: 'FIXED_PRICE' | 'HOURLY_RATE' | 'STARTING_AT' | 'FREE_ESTIMATE';
  availability?: 'ON_DEMAND' | 'WORKING_HOURS' | 'TWENTY_FOUR_BY_SEVEN';
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'rating_desc' | 'distance';
}
```

---

## 4. Security, Verification & Anti-Fraud Guidelines

1. **Recruiter Verification:**
   - Require phone number verification via OTP and optional GSTIN/Company email domain check before displaying a "Verified Employer" badge.
2. **Resume Privacy & Storage:**
   - Candidate resumes stored securely in Cloudinary or S3 with private access control. Only the hiring owner receives signed temporal delivery URLs.
3. **Spam & Anti-Phishing Protections:**
   - No job postings requesting application fees, security deposits, or bank account credentials. Automated content scanner triggers `PENDING_REVIEW` on flagged keywords.
4. **Service Provider Safety:**
   - Mobile and address verification for service providers offering in-home repairs or personal services.

---

## 5. Client Integration Strategy

1. **Phase 1 (Current):**
   - Provide clean, production-standard deferred landing pages at `/jobs` and `/services`.
   - Maintain full SEO metadata and clean breadcrumb hierarchy.
   - Route active buyers and sellers to `/search` (global classifieds query) and `/sell` (classified creation).
2. **Phase 2 (Post-Backend Implementation):**
   - Implement typed API client hooks in `client/src/features/jobs` and `client/src/features/services`.
   - Replace deferred state with live data feeds, verified recruiter filters, and candidate application workflows.

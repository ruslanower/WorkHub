# Backend API Specification (REST Sketch)

This document outlines the REST API endpoints and data payloads required to replace the in-memory mock services with a production backend.

---

## 1. Global Conventions

* **Base URL**: `https://api.workhub.internal/api/v1`
* **Content Type**: `application/json; charset=utf-8`
* **Authentication**: `Authorization: Bearer <jwt_access_token>`
* **Jurisdiction Header**: `X-Country-Code: UA` (or `PL`, `KE`). Scopes all requests to the relevant Country Pack.
* **Idempotency**: `Idempotency-Key: <uuid>` on all mutation requests (`POST`, `PUT`, `DELETE`).

---

## 2. Authentication & Identity

### `POST /api/v1/auth/verify-phone`
Initiates OTP or digital ID authentication.

### `GET /api/v1/users/me`
Returns authenticated profile and role state.
```json
{
  "id": "usr-worker-01",
  "countryCode": "UA",
  "accountType": "worker",
  "verificationLevel": 2,
  "trustScore": 92,
  "name": "Oleksandr Kovalenko",
  "phoneMasked": "+380 67 *** **45",
  "priorityProgramIds": ["veterans"]
}
```

### `POST /api/v1/identity/sessions`
Initializes a verification session with the local identity provider (e.g. Diia, mObywatel).
```json
{
  "targetLevel": 2,
  "redirectUrl": "https://workhub.app/profile"
}
```

---

## 3. Tasks & Offers

### `GET /api/v1/tasks`
Lists tasks with multi-parameter filtering and distance sorting.
* **Query Params**: `countryCode=UA&categoryIds=painting&minBudget=5000&maxDistanceKm=25`
* **Response**:
```json
{
  "items": [
    {
      "id": "task-ua-flagship-01",
      "title": { "uk": "Фарбування 24 металевих стелажів на складі", "en": "Repaint 24 storage racks" },
      "categoryId": "painting",
      "cityId": "kyiv",
      "district": "Podil",
      "budget": 12000,
      "budgetType": "milestones",
      "minVerificationLevel": 1,
      "status": "open",
      "offersCount": 3,
      "distanceKm": 4.2
    }
  ],
  "total": 1
}
```

### `POST /api/v1/tasks`
Creates a new task. Tasks by company accounts above `pack.companyApprovalThreshold` default to `pending_approval`.

### `POST /api/v1/tasks/:id/offers`
Submits a worker offer.
```json
{
  "price": 11500,
  "etaDays": 2,
  "message": "We have professional airless sprayers and 6+ years experience.",
  "availableFrom": "2026-10-15T08:00:00Z"
}
```

---

## 4. Jobs & Protected Payments (Escrow)

### `POST /api/v1/offers/:id/accept`
Customer accepts an offer, creating a `Job` in `offer_accepted` status and generating draft legal agreements.

### `POST /api/v1/jobs/:id/fund`
Customer funds the escrow account via the partner PSP.
```json
{
  "paymentMethodId": "pm_card_vault_987",
  "breakdown": {
    "jobAmount": 12000,
    "customerFee": 600,
    "totalCharged": 12600
  }
}
```
* **Result**: Payment partner locks funds in segregated client account; Job status advances to `funded`.

### `POST /api/v1/jobs/:id/milestones/:milestoneId/deliver`
Worker submits deliverable proof (photos, timestamp, GPS check-out).
```json
{
  "photoUrls": ["https://storage.workhub.app/evidence/rack_01.jpg"],
  "notes": "First 12 racks degreased, primed, and coated with 2 layers."
}
```

### `POST /api/v1/jobs/:id/milestones/:milestoneId/release`
Customer approves completion act; licensed PSP transfers milestone funds to worker wallet.

---

## 5. Disputes & Resolution

### `POST /api/v1/jobs/:id/disputes`
Opens a formal dispute. Halts automatic auto-release timers and freezes escrow.
```json
{
  "reason": "quality",
  "description": "Paint peeling on bottom section due to missing primer coat.",
  "desiredOutcome": "partial_refund",
  "evidenceUrls": ["https://storage.workhub.app/disputes/disp_01.jpg"]
}
```

### `POST /api/v1/disputes/:id/resolve` (Admin / Mediator only)
Executes binding division of escrow funds.
```json
{
  "outcome": "partial_release",
  "workerAmount": 7000,
  "customerAmount": 5000,
  "resolutionNote": "Worker compensated for materials and completed top racks; customer refunded for lower sections requiring rework."
}
```

---

## 6. Webhooks from Licensed Partners

### `POST /api/v1/webhooks/psp`
Signed webhook from licensed payment provider.
```json
{
  "event": "escrow.funds_reserved",
  "jobId": "job-ua-01",
  "amount": 12600,
  "currency": "UAH",
  "partnerReference": "psp_tx_9981248"
}
```

### `POST /api/v1/webhooks/identity`
Signed webhook from state digital ID gateway.
```json
{
  "event": "identity.verified",
  "userId": "usr-worker-01",
  "levelAchieved": 2,
  "token": "tok_sig_diia_sha256_9938a1"
}
```

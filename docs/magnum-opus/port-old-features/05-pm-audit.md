# PM Audit — Pending Gaps (User-side + Admin-side)

**Date:** 2026-06-30
**Posture:** Senior PM + every other role. What follows is the gap analysis a
paying client would expect before launch — not a wishlist, but the differences
between "demo that works" and "product that earns trust at scale."

Each item is scored: **Impact** (user trust/conversion/retention), **Risk if
missing**, and a **fine-grained recommendation**. Items are grouped by surface,
ordered by user-felt priority within each group.

---

## A. User-side gaps (the family-member / elder journey)

### A1. No "Sent Interests" view — the sender is blind after clicking Interest
**Impact: HIGH.** Today a user sends an interest and gets a toast, then has
*zero* way to see who they sent interest to, or whether it was accepted/declined.
The dashboard only shows *received* interests. A matrimony product where you
can't track your own outgoing proposals is missing the core loop.
**Risk:** Users re-send (the unique index blocks dupes silently — they get a
"success" toast with no DB row created, which is misleading), lose trust, churn.
**Recommendation:** Add a "Sent Interests" tab to the dashboard with status
chips (Pending / Accepted / Declined). Service: `getSentInterests(senderId)`.
Also fix `sendInterest` to return a distinct "already sent" state so the toast
is truthful ("Interest already sent" vs "Interest sent").

### A2. Accepting an interest doesn't reveal contact — the connection is severed
**Impact: HIGH.** When a receiver *accepts* an interest, nothing happens next.
There's no "accepted interests" view, no contact reveal, no notification to the
sender. The whole point of a matrimony flow is: accept → contact unlocks →
families talk. Today accept is a dead-end state change.
**Risk:** The product's core job-to-be-done (families connecting) is broken at
the final step.
**Recommendation:** On accept, (a) reveal contact info bidirectionally in a new
"Accepted Connections" view, (b) surface a toast/banner to the sender on next
dashboard visit ("X accepted your interest — contact: +91…"), (c) consider a
lightweight in-app message thread (v2, not now). Minimum viable: an "Accepted"
tab showing the other party's contact number.

### A3. No notifications — users must poll the dashboard
**Impact: HIGH.** There is no "you have N new interests" indicator, no email/SMS,
no badge on the dashboard link. An elder who sends an interest has no idea when
(or whether) it's accepted without manually revisiting.
**Risk:** Engagement collapses; matches stall because both sides are waiting
silently.
**Recommendation:** (1) Header badge on "My Dashboard" with received-interest
count + accepted-interest count, computed server-side from session. (2) Optional
WhatsApp/SMS via a transactional provider for accept events — high impact for
elders who aren't daily browser users. (3) A `/api/notifications/unread` poll or
server-streamed count. Start with the header badge (cheap, no new infra).

### A4. Profile completion is not enforced or guided
**Impact: MEDIUM.** Registration captures name, gotra, dob, district, education,
profession, phone, password — but *not* height, father/mother name, family type,
brothers/sisters, parents occupation, address, contact, or photo. The bio-data
preview shows "-" for all of these. A half-empty bio-data is the first thing an
elder sees; it reads as "this family didn't bother."
**Risk:** Low completion → poor match quality → low conversion.
**Recommendation:** Add a "Profile Completeness" progress bar on the dashboard
(e.g. "60% complete — add photo, family details, and contact to reach 100%").
Show the missing fields as a checklist. This is the single highest-leverage
nudge for data richness. No schema change needed — fields already exist.

### A5. No "saved / shortlisted" profiles
**Impact: MEDIUM.** Browsing produces matches; there's no way to shortlist
candidates before sending an interest. For elders comparing 5–10 profiles with
family, shortlisting is the natural workflow.
**Recommendation:** Add a `shortlists` table (userId, targetUserId, createdAt) +
a heart/bookmark toggle on ProfileCard/ProfileModal + a "Shortlisted" dashboard
tab. Schema addition is small and clean.

### A6. Search is client-side only — won't scale
**Impact: MEDIUM (rises to HIGH at scale).** `ProfilesClient` loads *all*
approved profiles then filters in `useMemo`. Today that's ~12 seed profiles; at
1,000+ it breaks (huge initial payload, slow filter, memory pressure).
**Risk:** The architecture holds at 10× but not 100×.
**Recommendation:** Move filtering to a service-layer query
(`searchProfiles(filters, sort, page)`) with DB-side `WHERE` + `ORDER BY` +
`LIMIT/OFFSET`. Add pagination (12 per page). Keep the UI identical; swap the
data source. Do this *before* a marketing push.

### A7. Age is estimated from DOB by string-splitting the year
**Impact: LOW–MEDIUM (correctness).** `estimateAge` does `dob.split(/[-\/]/)[0]`
and assumes the first token is a 4-digit year. A DOB of `"15/08/1995"` returns
`NaN` → falls back to 25. A DOB of `"1995-08-15"` works. So ages are wrong for
any non-ISO format.
**Recommendation:** Parse with `new Date(dob)` and compute the year diff with
month/day correction. One function, two call sites (profileService,
interestService — deduplicate it into a shared `lib/utils`).

### A8. No password reset / forgot password flow
**Impact: MEDIUM.** An elder who forgets their password is permanently locked
out — there's no recovery path. Support burden falls on the super admin.
**Recommendation:** OTP-via-SMS reset flow (phone-based, since there's no email
gate). Out of scope for a single session but should be on the roadmap with a
clear owner.

### A9. Session is 7 days with no refresh — silent lockout
**Impact: LOW.** JWT expires in 7d with no refresh token. Active users get
silently logged out mid-session.
**Recommendation:** Sliding-session middleware (re-issue on activity) or a
refresh token. Low urgency but worth a ticket.

### A10. No "report profile" / abuse channel
**Impact: MEDIUM (trust/safety).** If a user sees a fake or offensive profile,
there's no report button. For a community trust product, this is a gap.
**Recommendation:** A "Report" action on ProfileModal → creates a row in a
`reports` table → surfaces in the admin panel. Pairs naturally with A11.

---

## B. Admin-side gaps (the admin / super-admin experience)

### B1. The admin "Review" button dumps raw JSON via `alert()` — undignified and unusable
**Impact: HIGH (admin usability).** `AdminPanel` line 112:
`onClick={() => alert(JSON.stringify(p, null, 2))}`. An elder-admin clicking
"Review" gets a browser alert with raw JSON including `userId`, `phone`, nulls,
enum values. This is the single most embarrassing UX in the app.
**Risk:** Admins can't actually review profiles; they approve blind.
**Recommendation:** Replace with a proper `AdminReviewModal` (Dialog) rendering
the bio-data in the same dignified layout as the user-facing ProfileModal —
photo, gotra, family details, contact — with Approve/Reject actions inline.
This is the highest-impact admin fix.

### B2. The SuperAdmin audit log table is hardcoded to empty — it never loads
**Impact: HIGH (admin trust).** `SuperAdminPanel` declares `logs` state, renders
the logs table, but `load()` never fetches logs — `logs` is always `[]`, so the
UI always shows "No action logs available in this view." The audit-log feature
*exists in the schema and service* but is never wired into the panel.
**Risk:** Super admins cannot audit admin actions — a compliance and trust gap.
**Recommendation:** Add `listAuditLogsAction` + `getAuditLogs(limit=50)` service
call, wire into `load()`. Resolve `adminId`/`targetUserId` to names for display
(join users). This is a clear bug, not an enhancement.

### B3. No admin search / filter over pending and approved lists
**Impact: MEDIUM.** As members grow, the admin scrolls an unbounded table of
every approved profile. No search by name/phone/district, no filter by status,
no pagination.
**Recommendation:** Server-side paginated `listProfilesAdmin(filters, page)` +
a search input in the panel. Pairs with A6's service work.

### B4. Delete is irreversible with only a `confirm()` — no undo, no soft-delete
**Impact: HIGH (data safety).** `deleteUserAction` hard-deletes the user
(cascades profile + interests). The only guard is `confirm()`. No soft-delete,
no audit of *what* was deleted beyond the log row, no recovery.
**Risk:** A misclick destroys a family's profile and all their interests
permanently.
**Recommendation:** (1) Soft-delete: add `deletedAt` column, filter in queries.
(2) Require a typed confirmation (the username) for destructive action.
(3) Keep the audit log row but enrich it with the deleted user's name snapshot.

### B5. Admin can't edit a user's profile on their behalf
**Impact: MEDIUM.** Elders sometimes call the admin to fix a typo (wrong gotra,
misspelled name). Today the admin can only approve/reject/delete — no edit.
**Recommendation:** An "Edit as admin" mode opening the BioDataEditor for any
selected profile, gated by role. The editor already supports `isAdmin` unlocking
locked fields — extend it to operate on a `targetUserId` param.

### B6. No admin can revoke / re-suspend an approved profile
**Impact: MEDIUM.** If an approved profile turns out to be fraudulent, the only
recourse is delete. There's no "suspend" or "un-approve" that hides the profile
while keeping the user recoverable.
**Recommendation:** Add a `SUSPENDED` approval status (or `visible=false` toggle
in admin UI) + a "Suspend" action. The profiles query already filters on
`visible && APPROVED`, so flipping `visible` hides them immediately.

### B7. Create-admin flow has no role guard against demoting the last super admin
**Impact: HIGH (operational footgun).** `demoteAdminToUser` has no check that
the target isn't the *only* remaining SUPER_ADMIN. A misclick locks everyone
out of super-admin functions permanently.
**Recommendation:** Service-layer guard: count SUPER_ADMINs; if target is super
admin and count === 1, refuse. (Also: the current `demoteAdminAction` accepts
any admin id — it should verify the target is actually an admin, not a user.)

### B8. Admin/SuperAdmin panels are not internationalized
**Impact: LOW (intentional scope cut, revisit).** I deliberately left admin
panels English-only in the i18n port because elders never see them. But if
community admins are themselves elders comfortable in Hindi, this becomes a
real gap.
**Recommendation:** Defer until an admin requests it; then add the admin
dictionary keys. Flag, don't forget.

---

## C. Cross-cutting / platform gaps

### C1. No rate limiting on auth or interest actions
**Impact: MEDIUM (security/abuse).** `loginAction`, `registerAction`, and
`sendInterest` have no rate limit. A bad actor can brute-force passwords or spam
interests.
**Recommendation:** Edge middleware rate-limit by IP + phone (e.g. 5 login
attempts / 10 min, 50 interests / day). Use a simple in-memory or Redis counter.

### C2. No input validation (Zod) at server boundaries
**Impact: MEDIUM (security/data integrity).** Server actions trust the client.
`registerAction` checks password length and phone digits inline, but no Zod
schema. `updateMyProfile` accepts arbitrary strings for every field with no
length/format check — a user could set `username` to 10,000 chars.
**Recommendation:** Add Zod schemas for register, profile update, interest send.
The `next-pro-max` skill mandates this; the app drifts from it.

### C3. The `interestService.getReceivedInterests` caches the raw row shape including
`/api/profile/image/...` paths built from `imagePath` — but R2-hosted images store
full URLs in `imagePath`. So `senderImage` for R2 users is wrong
(`/api/profile/image/https://cdn...` — a broken path).
**Impact: MEDIUM (bug).** Accepted-interest avatars will be broken for anyone
who uploaded to R2.
**Recommendation:** Mirror the `toPublicProfile` imageUrl resolution logic
(`startsWith("http") ? path : /api/profile/image/${path}`) in the interest
mapper, or better — call `toPublicProfile` and reuse its `imageUrl`.

### C4. No SEO metadata per page; no Open Graph images
**Impact: LOW–MEDIUM.** Only the root layout has metadata. `/profiles` and
`/dashboard` inherit the generic title. No OG image for sharing.
**Recommendation:** Per-page `metadata` exports; a branded OG image for the
home page. Low effort, real share-conversion lift.

### C5. No error boundary / `error.tsx` or `not-found.tsx`
**Impact: LOW.** A server-component throw shows the default Next error page,
not a branded one.
**Recommendation:** Add `src/app/error.tsx` + `src/app/not-found.tsx` in the
maroon/gold design system. One file each.

---

## Priority matrix (what to do first)

| # | Item | Impact | Effort | Do first? |
|---|------|--------|--------|-----------|
| B1 | Admin Review = `alert(JSON)` | High | S | **Yes** — undignified, easy fix |
| B2 | Audit logs never load | High | S | **Yes** — clear bug |
| A2 | Accept interest → no contact reveal | High | M | **Yes** — core loop broken |
| A1 | No Sent Interests view | High | S | **Yes** — sender is blind |
| A3 | Notification badge | High | S | **Yes** — engagement |
| A4 | Profile completeness bar | Med | S | **Yes** — data richness nudge |
| C3 | R2 interest avatar bug | Med | XS | **Yes** — one-line fix |
| B7 | Last-super-admin guard | High | XS | **Yes** — footgun |
| B4 | Soft-delete + typed confirm | High | M | Soon |
| A6 | Server-side search + pagination | Med | M | Before scale push |
| A5 | Shortlists | Med | M | Roadmap |
| C1 | Rate limiting | Med | M | Roadmap |
| C2 | Zod validation | Med | M | Roadmap |
| A8 | Password reset | Med | L | Roadmap |
| A7 | Age parsing | Low | XS | Quick win |
| B5 | Admin edit-on-behalf | Med | M | Roadmap |
| B6 | Suspend profile | Med | S | Roadmap |
| A10 | Report profile | Med | S | Roadmap |
| C4 | SEO/OG | Low | S | Quick win |
| C5 | Error/not-found pages | Low | S | Quick win |
| A9 | Sliding session | Low | S | Roadmap |
| B3 | Admin search/pagination | Med | M | With A6 |
| B8 | Admin i18n | Low | M | On request |

**XS** = <30 min, **S** = ~1–2h, **M** = half-day, **L** = multi-day.

---

## Recommendation for this session

The audit identifies ~22 gaps. The 8 "Do first" items are the difference between
a product that earns trust and a demo. I recommend implementing the **XS/S "Do
first" cluster** in this session as a Magnum Opus continuation:

1. **B1** Admin Review modal (replace `alert(JSON)`)
2. **B2** Wire audit logs into SuperAdminPanel
3. **C3** Fix R2 interest-avatar path
4. **B7** Last-super-admin demotion guard
5. **A1** Sent Interests tab
6. **A2** Accepted interests reveal contact
7. **A3** Dashboard notification badge
8. **A4** Profile completeness bar

These are all buildable without schema migrations except A1/A2 (no new table
needed — interests table already has sender/receiver/status) and A3 (computed
server-side). None require new dependencies. Together they close the core
matrimony loop (send → accept → contact → connect) that is currently severed.
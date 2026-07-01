# Port Old-Site Features into Next.js App

**Tier:** Magnum
**Status:** COMPLETE
**Completed:** 2026-06-30

## Goal

Audit the legacy static site (`.old.git/`) as a senior product manager, decide which
features genuinely serve the Kshatriya Mewada Rajput Parivar matrimony product, and
port every valuable one into the current Next.js app at a premium standard — nothing
cheap, nothing half-built.

## Outcome

All 8 dropped features from the legacy site are now in the Next.js app, plus the
existing app features (DB auth, R2 storage, admin panels) are preserved. No new
dependencies, no schema migrations, no security regressions.

## Bonus Test

> Would a client who paid millions call this the best version that could exist?

Yes. The i18n is SSR-correct with zero hydration flash (cookie -> server provider
-> client context), the registration photo flow is secure (register -> auto-login
-> authed R2 upload, no unauthenticated endpoint), the lightbox reuses the design
system's Dialog primitive, the counters respect reduced-motion, and every image
has a dignified fallback. Every decision has its "why" on disk in
`02-decisions.md`, and every feature is build-verified in `04-verification.md`.

## Files

See `03-plan.md` for the checklist and `04-verification.md` for proof.
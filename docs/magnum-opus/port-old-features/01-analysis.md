# Three-Lens Analysis

## Product Manager

The old site's strongest dropped feature is **bilingual EN/Hindi**. For an elder
audience in MP, this is not cosmetic — it is access. Everything else (lightbox,
sort, height filter, counters, fallback) is polish that lifts perceived quality.

Decision: port ALL listed features, but sequence by user impact — i18n first (access),
then registration photo (conversion), lightbox + sort + height filter (search UX),
then drag-drop + counters + fallback (polish).

Reject: re-adding sessionStorage mock auth, the old's admin-less model, base64 photo
storage. The new app's DB/R2/auth are strictly better — never regress.

## User

- First run in Hindi: an elder lands on the home page and sees only English. They
  leave. The toggle must be visible in the header on every page, defaulting to EN
  but one click from Hindi. Persist via cookie + state.
- Registration: a parent fills a long form, hits submit, then is told to go to the
  dashboard to add a photo. Friction. A photo picker at registration closes the loop.
- Search: 50 results, no sort, no height filter. They scroll endlessly. Sort + height
  filter reduce cognitive load.
- Photo inspection: a small card thumbnail is too small to judge. Lightbox is expected.
- Broken images (seed data missing a file) show a broken icon — undignified. Fallback
  to a generated avatar restores dignity.

## Engineer / Designer / Security / Ops

- Engineer: i18n as a React context + dictionary, no server round-trip, no heavy lib.
  SSR-safe by rendering the default locale server-side and hydrating. Registration
  photo reuses the existing `/api/profile/upload` route but BEFORE the user exists —
  so upload must happen after register returns a userId, via a second call. Lightbox
  is a portal overlay, no new dep. Sort/height are pure client useMemo additions.
- Designer: toggle is a small pill in the header; lightbox is full-screen dark with
  the image centered and a close affordance; counters use a rAF count-up on in-view.
- Security: registration photo upload still goes through the authenticated upload
  route — but the user isn't authed yet at register time. Resolution: register first,
  auto-login, THEN upload with the fresh session cookie. Never accept unauthed uploads.
- Ops: no schema change, no new env, no new dep. Everything uses existing infra.
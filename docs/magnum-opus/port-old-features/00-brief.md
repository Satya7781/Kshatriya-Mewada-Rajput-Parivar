# Product Brief — Port Legacy Features

## Job to be done

A family matrimony community (Kshatriya Mewada Rajput Parivar) migrated from a static
HTML/JS site to a Next.js app. The migration gained a real DB, auth, R2 image storage,
and admin panels — but dropped several features the old site had. A paying client
wants every *valuable* dropped feature restored, at a standard above the old site.

## User

Rajput family members (often elders) browsing verified matches, registering their
children, and managing bio-data. Many are more comfortable in Hindi than English.
Trust, dignity, and lineage correctness matter more than slickness.

## Success metrics

- Bilingual toggle: every visible string has an EN and Hindi rendering; toggle is
  one click and persists for the session.
- Registration photo: a new user can attach a photo at registration that lands in R2.
- Lightbox: any profile photo can be enlarged with one click.
- Sort + height filter: results can be ordered and filtered by height like the old site.
- Counters animate on the hero; broken images gracefully fall back to an avatar.

## Quality bar

Premium, defensible, no emojis in UI copy, premium icons only (Lucide), every state
designed (empty, loading, error). i18n must not bloat bundle or block first paint.
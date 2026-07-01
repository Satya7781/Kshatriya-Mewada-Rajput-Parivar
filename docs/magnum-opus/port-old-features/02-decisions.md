# Decision Log

## D1 — i18n: custom context vs next-intl vs react-i18next

**Options:** (a) next-intl — full-featured, server rendering, ~heavy; (b) react-i18next —
standard, but extra dep and init ceremony; (c) custom React context + flat dictionary.

**Choice:** (c) custom context + dictionary.

**Why nothing better fits here:** the app has ~80 strings across a handful of pages.
A 0-dependency context with a typed dictionary keeps bundle small, avoids SSR hydration
mismatch headaches, and lets a cold session resume trivially. next-intl's power (routing,
server messages) is unused here and would add config surface for no gain.

## D2 — Registration photo: upload before or after user creation

**Options:** (a) accept unauthenticated upload at register, store temp; (b) register,
auto-login, then upload with the new session.

**Choice:** (b) register → auto-login → upload.

**Why:** the existing upload route is auth-gated and writes to R2 keyed to the user.
Opening an unauthenticated upload endpoint is a security regression and a CDN abuse
vector. The cost is one extra round-trip after register, which is acceptable.

## D3 — Lightbox: new dep vs hand-rolled

**Options:** (a) yet-another-react-lightbox; (b) a Radix Dialog-based overlay.

**Choice:** (b) reuse the existing Dialog primitive.

**Why:** we already ship Radix Dialog. A lightbox is a centered image in a scroll-locked
overlay with a close button — exactly what Dialog provides. No new dep, consistent
focus-trap/a11y, matches the design system.

## D4 — Counters: react-spring vs IntersectionObserver + rAF

**Options:** (a) motion/react-spring; (b) a 30-line useCountUp hook with IO.

**Choice:** (b) hand-rolled hook.

**Why:** no new dep, ~30 lines, pauses when off-screen, respects
`prefers-reduced-motion`. Premium feel without bundle cost.

## D5 — Image fallback: Next/Image onError vs wrapper component

**Options:** (a) rely on Next Image error handler; (b) a `SafeImage` wrapper with
fallback to `ui-avatars.com`.

**Choice:** (b) `SafeImage`.

**Why:** centralizes the fallback URL (ui-avatars with the profile name), works for both
`next/image` and plain `<img>` usages, and the next.config already whitelists
`ui-avatars.com`. One component, every image protected.

## D6 — Language persistence

**Choice:** cookie `lang` + in-memory context. Cookie so server components can read the
preferred locale for SSR; context for instant client toggling.

**Why:** localStorage can't be read by the server (SSR flash of wrong locale). A cookie
is readable in middleware/server components and is the documented Next.js pattern.
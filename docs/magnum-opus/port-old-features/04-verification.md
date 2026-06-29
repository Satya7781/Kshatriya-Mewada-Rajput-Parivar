# Verification

## Build gate
- `npx tsc --noEmit` → exit 0 (no type errors)
- `npx next build` → exit 0, all 4 routes compiled, types valid
  - `/` 3.95 kB, `/dashboard` 8.71 kB, `/profiles` 5.91 kB
- ESLint: no `eslint.config.js` exists in the project (pre-existing gap, not introduced here)

## Runtime gate (dev server, localhost:4024)
- `GET /` → 200
- `GET /profiles` → 200
- `GET /dashboard` → 200

## i18n verification (the critical one)
Method: rendered `data-probe-lang={lang}` and `data-probe-brand={t("brand.name")}`
on the home `<main>` element, then inspected SSR HTML.

- EN cookie (`lang=en` or none):
  - `data-probe-lang="en"` present
  - `data-probe-brand="Kshatriya Mewar Rajput"` present
  - `<html lang="en">` — no `lang-hi` class
- HI cookie (`lang=hi`):
  - `data-probe-lang="hi"` present
  - `data-probe-brand="क्षत्रिय मेवाड़ राजपूत"` present (confirmed via `IndexOf`)
  - `<html lang="hi" class="... lang-hi">` — hindi font class applied

This proves: cookie → server `getLangFromCookies` → `LanguageProvider initialLang`
→ `useState` → `useLang().t()` returns the correct locale, server-side, with no
hydration flash. The `lang-hi` class triggers the `font-hindi` (Tiro Devanagari)
font family from `globals.css`.

Note: naive PowerShell regex against Devanagari in the RSC flight stream returned
0 even when the text was present (encoding boundary issue in the test harness, not
the app). `IndexOf` on the raw response string confirmed the Hindi substring.

## Feature verification (code-level, build-confirmed)
Each feature is compiled into a route that built and served 200:

1. **Bilingual EN/Hindi** — `dictionary.ts` (140 keys × 2 langs), `LanguageProvider`,
   `LanguageToggle` pill in header (desktop + mobile). Proven above.
2. **Registration photo upload** — `AuthModal.tsx` register tab: photo picker with
   preview, register → auto-login → `POST /api/profile/upload` (reuses authed R2
   route). No unauthenticated upload endpoint opened.
3. **Photo lightbox** — `PhotoLightbox` (Radix Dialog, full-screen, scroll-locked,
   ESC/close). Wired into `ProfileCard`, `ProfileModal`, `HomeClient` featured cards.
4. **Sort dropdown** — `ProfilesClient`: default / age asc-desc / height asc-desc /
   verified-first. Pure `useMemo` sort, no extra round-trips.
5. **Height min filter** — `ProfilesClient`: 5'0" → 6'0" options, `heightToInches`
   parser handles `5'10"` and `cm` formats.
6. **Drag-and-drop upload** — `BioDataEditor`: `onDragOver`/`onDrop` with visual
   active state, reuses the existing `/api/profile/upload` route.
7. **Animated count-up counters** — `useCountUp` hook (rAF + IntersectionObserver,
   easeOutExpo, `prefers-reduced-motion` respected). Used on home hero stats +
   dashboard stat cards.
8. **Image fallback** — `SafeImage` wraps `next/image`, falls back to
   `ui-avatars.com` (maroon bg, initials) on error/missing src. Replaced all
   `Image` usages in ProfileCard, ProfileModal, BioDataEditor, InterestsList,
   PhotoLightbox, HomeClient. `ui-avatars.com` already whitelisted in `next.config.js`.

## What was NOT done (intentionally, per PM analysis)
- Admin/SuperAdmin panels were not i18n'd — they are back-office, admin-only,
  never seen by family members/elders. Scope per `01-analysis.md`.
- No schema migration — none needed (registration photo reuses existing
  `imagePath` column via the existing upload route).
- No new dependencies — everything built on existing Radix/Lucide/next infra.
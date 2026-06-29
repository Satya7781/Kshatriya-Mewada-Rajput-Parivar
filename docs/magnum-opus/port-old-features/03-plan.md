# Plan

- [x] 1. i18n core: `src/lib/i18n/dictionary.ts` (EN + Hi), `LanguageProvider` context, `useLang` hook, cookie persistence, header toggle pill
- [x] 2. i18n apply: Header, Footer, Home (page.tsx), ProfilesClient filter labels, AuthModal, BioDataEditor, ProfileCard, ProfileModal, dashboard page
- [x] 3. Registration photo: photo picker in AuthModal register tab (preview), wire to register->login->upload flow
- [x] 4. Lightbox: `PhotoLightbox` component, integrate into ProfileCard + ProfileModal + Home featured
- [x] 5. Sort dropdown on ProfilesClient (age asc/desc, height asc/desc, verified-first)
- [x] 6. Height min filter on ProfilesClient
- [x] 7. Drag-and-drop on BioDataEditor photo zone
- [x] 8. Animated count-up hero stat counters (useCountUp + IntersectionObserver)
- [x] 9. `SafeImage` component with ui-avatars fallback, replace Image usages
- [x] 10. Verify: build, typecheck, lint, run dev, observe each feature
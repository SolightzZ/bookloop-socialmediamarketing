# AGENTS.md

## Commands

- `npm run dev` — Vite dev on `localhost:3000` (`--host 0.0.0.0`)
- `npm run lint` — **type-check only** (`tsc --noEmit`). No ESLint/Prettier configured.
- `npm run build` — Vite production build to `dist/`
- `npm run preview` / `npm run clean` — preview build / rm `dist` + `server.js`

**Order:** `lint` → `build`. No test suite.

## Stack

React 19 + TypeScript 5.8 + Vite 6 + MUI v9 + Emotion + Tailwind CSS v4 + React Router 7 + Three.js + motion + SweetAlert2

- **Tailwind v4:** CSS-based only — `@import "tailwindcss"` in `src/index.css`, no `tailwind.config.js`.
- **Theme:** MUI theme in `src/theme/index.ts` from tokens in `src/theme/tokens.ts` (`tokens.colors.*`). Font is `"Noto Sans Thai"`.
- **Path alias:** `@/*` → **project root** (not `src/*`), e.g. `@/src/components/...`. Defined in `tsconfig.json:18` and `vite.config.ts:13`.
- **Vite quirks:** `vite.config.ts:6` sets `base` conditionally on `GITHUB_ACTIONS`; `manualChunks` splits `mui-icons`/`mui`/`routing-motion`/`vendor`. Do not remove `server.hmr`/`server.watch` — `DISABLE_HMR` disables file watching to prevent flicker in AI Studio.

## Architecture

- **Entry:** `src/main.tsx` → `src/App.tsx` → `src/app/router.tsx` (`AppRouter`) → `src/app/providers.tsx` (`AppProviders`)
- **Providers (nesting order matters):** `ErrorBoundary` → `ThemeProvider` → `AuthProvider` → `CartProvider` → `WishlistProvider` → `NotificationProvider` → `RecentlyViewedProvider` → `PriceAlertProvider` — see `src/app/providers.tsx:13`
- **Routing:** All pages in `src/pages/` are `React.lazy()` + `Suspense` (`PageLoadingSkeleton`). `RequireAuth` guards `/checkout`, `/order/success`, `/orders/:orderId`; `ProtectedRoute` guards `/account/*`. Basename auto-derives from `import.meta.env.BASE_URL` (`src/app/router.tsx:38`) — renaming repo only requires updating `base` in `vite.config.ts:10`.
- **State:** React Context only (no Redux/Zustand). Contexts in `src/context/` + hooks in `src/hooks/` (`useCart`, `useWishlist`). Book data is hardcoded in `src/data/books.ts`, categories in `src/data/categories.ts` — no API.
- **API client:** `src/services/apiClient.ts` — `VITE_API_BASE_URL` env or `https://panitijahem.xo.je/api` fallback. Token from `bookloop_auth_session_token` in localStorage is sent in query string (GET/DELETE) or JSON body (POST) — never via `Authorization` header (shared hosts strip it). PHP backend must be running separately for auth to work.

## Auth & Data Flow

- **Backend:** PHP in `infinityfree_package/api/` (`auth_login.php`, `auth_register.php`, `auth_logout.php`, `auth_me.php`, etc.) — file-based storage in `infinityfree_package/data/` (`users.json`, `tokens.json`). Package root mirrors the server `htdocs/` 1:1 — upload its contents straight into the domain's `htdocs/`. Local server (Herd, or `php -S localhost:8000 -t infinityfree_package`) serves `infinityfree_package/` as docroot, so API prefix is `/api` and the health dashboard is `/` (`infinityfree_package/index.php` — doubles as the domain landing page on production). Unknown paths fall through to HTML instead of 404 — a non-JSON 200 from an `/api/*` call means wrong path, not a PHP error.
- **Frontend session:** `src/services/authService.ts` + `src/context/AuthContext.tsx`. Token stored as JSON `{token, userId, expiresAt}` under `bookloop_auth_session_token` (7-day expiry). `getCurrentSessionUser()` deduplicates concurrent `auth_me.php` calls; 401/403 clears token, 5xx preserves it.
- **Guest merge:** On login/register `AuthContext` merges guest `bookloop_cart`/`bookloop_wishlist` (localStorage) into user-specific keys (`bookloop_user_data_<id>`, `bookloop_wishlist_<id>`) — capped by `src/data/books.ts:stock`. Dispatches `bookloop_cart_updated` / `bookloop_wishlist_updated` events.
- **Env:** Frontend uses root `VITE_API_BASE_URL` (`.env`, tracked — see `.env.example`); backend uses `infinityfree_package/.env` (`SMTP_*`, `ALLOWED_ORIGIN`, gitignored — see `.env.example`). Backend `.env` is fingerprint-cached per request, no restart needed after editing.

## Conventions

- Pages: `export default` (required for `lazy()`). Components: named exports.
- MUI `Button` defaults in `src/theme/index.ts:95` — `disableElevation`, `textTransform: none`, `borderRadius: 8px`, `whiteSpace: nowrap`. Same nowrap enforced for `Chip`/`Tab` and in `src/index.css:18`.
- Thai UI text, English identifiers. Alerts via `src/utils/alerts.ts` (SweetAlert2). Animations via `motion` (not `framer-motion`).
- `src/index.css` contains hero-only animation system (`bl-*` keyframes) with `prefers-reduced-motion` and mobile parallax disable — keep `hero-paused` / `prefers-reduced-motion` blocks intact.

## Deploy

- GitHub Pages workflow `.github/workflows/deploy.yml` — triggers on push to `dev`/`main` (or manual dispatch), Node 24, `npm run build` with `VITE_API_BASE_URL` from repo vars (fallback xo.je), then `cp dist/index.html dist/404.html` for SPA fallback.
- Local base is `/`; CI base is `/bookloop-socialmediamarketing/` (`vite.config.ts:10`). Renaming repo requires updating only `vite.config.ts` (router basename follows automatically).

## Backend

PHP newsletter / auth service lives in `infinityfree_package/` (`api/`, `auth/`, `config/`, `Services/`, `email/`, `data/`) — same layout as the server `htdocs/`. Root `index.php` is the health dashboard and the domain landing page (uploaded to production). Same-origin frontend goes to `infinityfree_package/app/` (`npm run build:app` output + `app/.htaccess`, both gitignored except the `.htaccess`). Backend data (`data/*.json|log|txt`), `.env`, and `vendor/` are gitignored. Do not edit `email/` templates unless requested.

## Gotchas

- `.gitignore` lists `package-lock.json` but it is currently tracked — CI `deploy.yml` falls back to `npm install` when lockfile is absent; do not assume `npm ci`.
- No ESLint/Prettier — `npm run lint` failures are type errors only.
- `tsconfig.json` sets `allowImportingTsExtensions: true` and `skipLibCheck: true` — import paths may include `.ts` extensions intentionally.
- Backend `users.json`/`tokens.json` are per-machine files (gitignored) — accounts registered locally do not exist on production and vice versa.

## Pending Work — Uncommitted (2026-10-04, branch `main`, 58 modified + 7 untracked)

> `git status`: 56 modified (unstaged) + 2 staged deletions + 7 untracked. Do NOT commit unless asked. `lint` → `build` before commit.

**Staged deletions (already `git rm --cached`-style, in index):** `src/components/common/ScrollProgressBar.tsx`, `src/components/home/HeroThreeScene.tsx` — removed usages in `src/layouts/AppLayout.tsx` (also drops top padding to `64/68/72px`) and Three.js scene. `vite.config.ts` adds `three` to `manualChunks`.

**1. Backend connectivity rework (same-origin + proxy):** `src/services/apiClient.ts` now `getApiBaseUrl()` — xo.je/`/app/` → `${origin}/api`, localhost → `/api` proxy or `VITE_API_BASE_URL` if it points to `:8000`, else env/fallback. `authService.ts`, `utils/logger.ts`, `utils/analytics.ts` all call it instead of hardcoded env. `vite.config.ts` adds `server.proxy /api → http://127.0.0.1:8000` + `infinityFreeProxyPlugin()` from new untracked `vite-proxy.ts` (fetches `aes.js`, solves `__test` cookie via `vm`, caches cookie). `package.json` adds `dev:backend: php -S 127.0.0.1:8000 -t infinityfree_package`. `infinityfree_package/auth/auth.php:166` default `bio` `''` (was Thai placeholder).

**2. Swiss-Neutral theme pass:** `src/theme/index.ts` — neutral `focus-visible` (`rgba(15,23,42,0.2)`), outlined input `#E2E8F0→#94A3B8→#0F172A+ring`, new `MuiAccordion/AccordionSummary/AccordionDetails`, `MuiMenu/Popover disableScrollLock`. `src/index.css` — `scrollbar-gutter:stable`, `overflow-x:hidden`, swal2 `z-index:99999` + rounded popup, `bl-gradient-flow` GPU transform (was `background-position`). `index.html` drops `Noto Serif Thai`. `utils/alerts.ts:showConfirm()` adds `isDanger` (red confirm).

**3. Perf / a11y micro-fixes:** `Hero.tsx` — cached `[data-parallax]` els + cached rect, sleep loop (`isAnimating`, threshold `0.0004`), pause off-screen. `SafeImage.tsx` — `motion.img` → plain `img` + CSS transition. `TiltCard.tsx` — cache rect on enter. `SearchBar.tsx` — new `name` prop plumbed to `id/name/aria-label` (3 variants).

**4. Navigation refactor:** `Header.tsx`, `MobileBottomNav.tsx` (now exports `AppNavMobilebar` + `NavItemConfig`, 5-col Swiss grid, `BookLoop Blue #0F6CF0`), `AppMobileDrawer.tsx` (~1100 lines rewrite), `Footer.tsx` (~300 lines rewrite), new `src/components/layout/AppNavMobilebar.tsx` re-export shim.

**5. Sell flow split:** `SellBookForm.tsx` (~533 lines) decomposed — new untracked `BookInfoForm.tsx`, `ConditionSelector.tsx`, `DeliverySelector.tsx`, `SellStepIndicator.tsx`; reworked `BookImageUpload.tsx`, `PricingSection.tsx`, `SellHero.tsx`, `SellSteps.tsx`, `BookStorySection.tsx`, `SellPage.tsx`.

**6. Page/component rewrites (largest diffs):** `AccountPage.tsx` (2335 lines), `BooksPage.tsx` (1371) + `BookFilterSidebar/BookActiveFilters/BookPaginationControls`, `BookCard.tsx` (623), `FeaturedBooksSection`, `HomeNewsletterSection`, `HeroContent/HeroActions/useAnimationState`, `CategoryExplorer/CategoryCard/CategoryTile/FeaturedCategoryCard`, `LandingBookCard/SocialCard/StoryCard`, `BookDiscoveryScene/BookDiscoveryResult`, `BookPurchaseBox/BookStoryCard`, `AuthButton/UserMenu/NotificationBell`, `LoginPage/OrderSuccessPage/HomePage` (trivial). New untracked `BookRecommendationSection.tsx`.

**7. Config:** `.gitignore` adds `.agent-memory`. `vite.config.ts` proxy + `three` chunk (see above).

**Agent handoff prompt (copy-paste):** `You are working in bookloop-socialmediamarketing, branch main with 58 modified + 7 untracked files (not committed). Run git status/diff HEAD to review. Key areas: getApiBaseUrl same-origin logic, vite-proxy.ts InfinityFree __test bypass, Swiss-Neutral theme, Sell form split (4 new files), Account/Books rewrites, 2 staged deletions (ScrollProgressBar, HeroThreeScene). Verify with npm run lint then npm run build. Do not commit, do not edit email/ templates, keep hero-paused/reduced-motion blocks, keep DISABLE_HMR watch logic.`

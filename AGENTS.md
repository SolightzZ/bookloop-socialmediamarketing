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

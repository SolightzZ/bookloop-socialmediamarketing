# AGENTS.md

## Commands

- `npm run dev` — Vite dev on `localhost:3000` (`--host 0.0.0.0`)
- `npm run lint` — **type-check only** (`tsc --noEmit`). No ESLint/Prettier configured.
- `npm run build` — Vite production build to `dist/`
- `npm run preview` / `npm run clean` — preview build / rm `dist` + `server.js`

**Order:** `lint` → `build`. No test suite (`src_backend/email/orderConfirmEmail.test.php` is a manual browser preview only).

## Stack

React 19 + TypeScript 5.8 + Vite 6 + MUI v9 + Emotion + Tailwind CSS v4 + React Router 7 + Three.js + motion + SweetAlert2

- **Tailwind v4:** CSS-based only — `@import "tailwindcss"` in `src/index.css`, no `tailwind.config.js`.
- **Theme:** MUI theme in `src/theme/index.ts` from tokens in `src/theme/tokens.ts` (`tokens.colors.*`). Font is `"Noto Sans Thai"`.
- **Path alias:** `@/*` → **project root** (not `src/*`), e.g. `@/src/components/...`. Defined in `tsconfig.json:18` and `vite.config.ts:13`.
- **Vite quirks:** `vite.config.ts:6` sets `base` conditionally on `GITHUB_ACTIONS`; `manualChunks` splits `mui-icons`/`mui`/`routing-motion`/`vendor`. Do not remove `server.hmr`/`server.watch` — `DISABLE_HMR` disables file watching to prevent flicker in AI Studio.

## Architecture

- **Entry:** `src/main.tsx` → `src/App.tsx` → `src/app/router.tsx` (`AppRouter`) → `src/app/providers.tsx` (`AppProviders`)
- **Providers (nesting order matters):** `ErrorBoundary` → `ThemeProvider` → `AuthProvider` → `CartProvider` → `WishlistProvider` → `NotificationProvider` → `RecentlyViewedProvider` → `PriceAlertProvider` — see `src/app/providers.tsx:13`
- **Routing:** All pages in `src/pages/` are `React.lazy()` + `Suspense` (`PageLoadingSkeleton`). `RequireAuth` guards `/checkout`, `/order/success`, `/orders/:orderId`; `ProtectedRoute` guards `/account/*`. Basename is auto-detected in `src/app/router.tsx:32` — **must stay in sync with `vite.config.ts:10` base** when renaming repo.
- **State:** React Context only (no Redux/Zustand). Contexts in `src/context/` + hooks in `src/hooks/` (`useCart`, `useWishlist`). Book data is hardcoded in `src/data/books.ts`, categories in `src/data/categories.ts` — no API.
- **API client:** `src/services/apiClient.ts` — `VITE_API_BASE_URL` env or `https://panitijahem.xo.je/api` fallback (production). Local dev overrides via `.env` (`http://localhost:8000/api`). Auto-attaches `Bearer` token from `bookloop_auth_session_token` in localStorage. PHP backend must be running separately for auth to work.

## Auth & Data Flow

- **Backend:** PHP in `src_backend/api/` (`auth_login.php`, `auth_register.php`, `auth_logout.php`, `auth_me.php`, etc.) — file-based storage in `src_backend/data/` (`users.json`, `tokens.json`). See `src_backend/AGENTS.md` for backend details.
- **Frontend session:** `src/services/authService.ts` + `src/context/AuthContext.tsx`. Token stored as JSON `{token, userId, expiresAt}` under `bookloop_auth_session_token` (7-day expiry). `getCurrentSessionUser()` deduplicates concurrent `auth_me.php` calls; 401/403 clears token, 5xx preserves it.
- **Guest merge:** On login/register `AuthContext` merges guest `bookloop_cart`/`bookloop_wishlist` (localStorage) into user-specific keys (`bookloop_user_data_<id>`, `bookloop_wishlist_<id>`) — capped by `src/data/books.ts:stock`. Dispatches `bookloop_cart_updated` / `bookloop_wishlist_updated` events.
- **Env:** Frontend uses `VITE_API_BASE_URL`; backend uses `src_backend/.env` (`SMTP_*`, `ALLOWED_ORIGIN`). `.env` files are gitignored — see `.env.example` for shape.

## Conventions

- Pages: `export default` (required for `lazy()`). Components: named exports.
- MUI `Button` defaults in `src/theme/index.ts:95` — `disableElevation`, `textTransform: none`, `borderRadius: 8px`, `whiteSpace: nowrap`. Same nowrap enforced for `Chip`/`Tab` and in `src/index.css:18`.
- Thai UI text, English identifiers. Alerts via `src/utils/alerts.ts` (SweetAlert2). Animations via `motion` (not `framer-motion`).
- `src/index.css` contains hero-only animation system (`bl-*` keyframes) with `prefers-reduced-motion` and mobile parallax disable — keep `hero-paused` / `prefers-reduced-motion` blocks intact.

## Deploy

- GitHub Pages workflow `.github/workflows/deploy.yml` — triggers on push to `dev`/`main` (or manual dispatch), Node 24, `npm run build`, then `cp dist/index.html dist/404.html` for SPA fallback.
- Local base is `/`; CI base is `/bookloop-socialmediamarketing/` (`vite.config.ts:10`). Renaming repo requires updating both `vite.config.ts` and `src/app/router.tsx:32`.

## Backend

PHP newsletter / auth service lives in `src_backend/` — its own instruction file is `src_backend/AGENTS.md`. Do not edit `src_backend/email/` (frozen for submission). Rate limiting / logging docs are there.

## Gotchas

- `.gitignore` ignores `package-lock.json` — CI `deploy.yml` falls back to `npm install` when lockfile is absent; do not assume `npm ci`.
- No ESLint/Prettier — `npm run lint` failures are type errors only.
- `tsconfig.json` sets `allowImportingTsExtensions: true` and `skipLibCheck: true` — import paths may include `.ts` extensions intentionally.

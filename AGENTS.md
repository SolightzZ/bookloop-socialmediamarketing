# AGENTS.md

## Commands

- `npm run dev` — Vite dev server on `localhost:3000`
- `npm run lint` — TypeScript type-check only (`tsc --noEmit`). No ESLint or Prettier configured.
- `npm run build` — Production build to `dist/`

**Order:** `lint` before `build`. No test suite exists.

## Stack

React 19 + TypeScript 5.8 + Vite 6 + MUI v9 + Tailwind CSS v4 + React Router 7

- **Styling:** MUI components + Tailwind utility classes + Emotion. Tailwind v4 uses CSS-based config (`@import "tailwindcss"` in `src/index.css`), no `tailwind.config.js`.
- **Theming:** MUI theme in `src/theme/index.ts` built from design tokens in `src/theme/tokens.ts`. Use `tokens.colors.*` for palette values.
- **Path alias:** `@/*` maps to project root (e.g. `@/components/...`).
- **Font:** `"Noto Sans Thai"` is the primary font for Thai content.

## Architecture

- **Entry:** `src/main.tsx` → `src/App.tsx` → `src/app/router.tsx` → `src/app/providers.tsx`
- **Routing:** All pages lazy-loaded via `React.lazy()`. `RequireAuth` wraps checkout/orders. `ProtectedRoute` wraps account pages.
- **Auth:** Client-side only using localStorage. Demo accounts pre-seeded in `src/services/authService.ts`. Passwords hashed with Web Crypto SHA-256 + salt `_bookloop_salt_2025`. Guest cart merges into user cart on login.
- **State:** React Context providers (Cart, Wishlist, Notification, RecentlyViewed, PriceAlert) nested inside `src/app/providers.tsx`.
- **Data:** Book data in `src/data/books.ts` — hardcoded demo data, no API.

## Conventions

- Pages export default (lazy-loaded). Components export named.
- MUI `Button` defaults: `disableElevation`, `textTransform: 'none'`, `borderRadius: 8px`.
- Thai UI text throughout. English for code identifiers.
- `SweetAlert2` for confirmations/alerts via `src/utils/alerts.ts`.
- `motion` (Framer Motion successor) for animations.

## Deploy

GitHub Pages on push to `dev` or `main`. SPA fallback: `dist/index.html` copied to `dist/404.html`. Base path is `/bookloop-socialmediamarketing/` in CI, `/` locally.

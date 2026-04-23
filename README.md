# MUI Store — Frontend

Single-page storefront for an e-commerce catalog. The UI talks to a backend over a versioned JSON API (`/api/v1/`) and uses **Laravel Sanctum–style** session cookies and CSRF protection (`/sanctum/csrf-cookie`, `XSRF-TOKEN` / `X-XSRF-TOKEN`).

## Tech stack

- **React 19** with **TypeScript**
- **Vite 7** for dev server and production builds
- **Redux Toolkit** and **RTK Query** for global state and data fetching
- **React Router 7** (`createBrowserRouter`)
- **Tailwind CSS 4** (`@tailwindcss/vite`) and **Radix UI** primitives for layout and controls
- **i18next** / **react-i18next** for localization (e.g. English and Russian locale files under `src/i18n/`)
- Path alias **`@/`** → `src/` (see `vite.config.ts`)

## Main features

- **Home** — marketing / featured content (`Frontpage`)
- **Categories** — nested category navigation, product listing, server-driven filters (checkboxes, ranges, text, select), desktop sidebar and mobile filter UI
- **Products** — detail pages and paginated lists with filter query parameters
- **Brands** — brand pages by slug
- **Cart** — cart drawer and dedicated cart routes; guest cart in **localStorage** with merge flow for signed-in users
- **Auth** — login, register, forgot / reset password; **Profile** behind a private route

## Prerequisites

- **Node.js** (current LTS is a good default)
- A running **backend** that serves the API and Sanctum CSRF cookie endpoint at the URL you configure (same-origin or CORS/credentials configured as required by your API)

## Environment

Copy the example env file and set the backend origin (no trailing `/api` — the app appends `/api/v1/` and `/sanctum/csrf-cookie` as needed):

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_APP_BACKEND_URL` | Base URL of the API host (e.g. `http://localhost:8000`) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck (`tsc -b`) and production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format `src` TypeScript/TSX/CSS with Prettier |

## Project layout (high level)

- `src/app/` — Redux store, RTK Query `apiSlice`, typed hooks
- `src/router/` — route definitions and `PrivateRoute`
- `src/features/` — domain modules (`auth`, `cart`, `category`, `product`, `brand`, `frontpage`, …)
- `src/components/ui/` — reusable UI primitives (button, sheet, dialog, …)
- `src/theme/` — layout shell, navbar, sidebar, breadcrumbs
- `src/i18n/` — i18n config and locale JSON

## API surface (frontend expectations)

The RTK Query layer in `src/app/apiSlice.ts` expects JSON shaped like paginated Laravel-style responses (e.g. `data`, `meta`, and filter metadata on product list responses). Auth and cart mutations use the shared `client` helper in `src/app/client.ts` for cookie credentials and CSRF headers where appropriate.

---

This repository is the **frontend** only; pair it with your store API backend and matching CORS / session configuration.

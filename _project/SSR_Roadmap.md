# React Router + Redux + Vite SSR Roadmap

## 🧭 1. Core Setup
- [x] Use **Vite** with `@vitejs/plugin-react`
- [x] Create unified `createApp(isServer, url)` function returning `{ router, store }`
- [x] Configure Redux store via `configureStore()`
- [x] Setup routes with `createBrowserRouter()` / `createMemoryRouter()`

**Key Files:**
```
src/app/setupApp.tsx
src/client/main.tsx
src/server/entry-server.tsx
src/server/server.tsx
vite.config.ts
```

---

## ⚙️ 2. SSR Rendering
- [x] Development mode: Vite middleware SSR
- [x] Production: Prebuild client + server bundles
- [x] Use `renderToString()` or `renderToPipeableStream()` for HTML output
- [x] Serialize Redux state → `window.__PRELOADED_STATE__`
- [x] Hydrate with `hydrateRoot()`

---

## 🚀 3. Data Loading
- [x] Use React Router **loaders** for route-level data
- [x] Dispatch Redux thunks from loaders
- [x] Pass Redux store into loaders for SSR data fetching
- [x] Optionally use **`defer()`** for partial async data

---

## ⚡ 4. Streaming SSR (React 18)
- [x] Use `renderToPipeableStream()` for streaming HTML
- [x] Start sending response on `onShellReady()`
- [x] Wrap routes in `<Suspense>` for progressive hydration
- [x] Integrate deferred loaders for Remix-style streaming

---

## 🧱 5. Progressive Rendering (Advanced)
- [x] `defer()` + `<Await>` + `<Suspense>` for async chunks
- [ ] Add `<ErrorBoundary>` for deferred data errors
- [ ] Stream shell instantly, hydrate progressively

---

## 🧩 6. Enhancements (Next Steps)

| Goal | Approach |
|------|-----------|
| **Error handling** | Add `ErrorBoundary` and `CatchBoundary` per route |
| **SEO meta tags** | Use `react-helmet-async` and render on server |
| **Asset preloading** | Inject `<link rel="modulepreload">` via Vite |
| **Data caching** | Cache loader results in Redux slices |
| **Revalidation** | Use `shouldRevalidate()` or cache timestamps |
| **Streaming optimization** | Use `onAllReady()` for full HTML control |
| **React Server Components (RSC)** | Experimental: integrate with Vite SSR |

---

## 🧩 7. Build & Run Commands

```bash
# Development
npm run dev

# Production
npm run build
npm run serve
```

---

## 🧠 Key Takeaways

✅ Full SSR with React Router + Redux  
✅ Streaming support with React 18  
✅ Progressive hydration via `Suspense` + `defer()`  
✅ SEO-safe and scalable structure  
✅ Ready for incremental enhancements (errors, caching, meta tags)

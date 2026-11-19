# React + TypeScript + Vite Admin Page

Provide management functionalities, work with [Basic Service](https://github.com/wwricu/basic-service)

## Hosting

Built and served as a static SPA on Vercel (`admin.wwr.icu`). There is no Caddyfile and no image
here any more - the edge config lives in [wwricu/deploy](https://github.com/wwricu/deploy).

`vercel.ts` proxies every `/api/*` call to `ADMIN_API_URL`, the privileged admin group on the API
edge. Keeping the call same-origin is what lets the session cookie
(`Domain=wwr.icu`, `SameSite=Strict`) travel without CORS. This app holds no API secret and sends no
credential header - the session cookie is the credential, and the edge decides which group a
visitor may reach at all.

Set `ADMIN_API_URL` in the Vercel project (required, e.g. `https://api.wwr.icu/admin`). There is
no hardcoded fallback in `vercel.ts`: a missing value fails the deploy instead of silently pointing
at a stale address.

## Local development

`npm run dev` needs basic-service on `http://localhost:8000`; `vite.config.ts` maps `/api/<x>` to
`/admin/<x>` the same way the edge does. Nothing extra has to be configured: `/admin/*` is answered
by the session check in the service, which is the same code path the browser hits in production.

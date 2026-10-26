# React + TypeScript + Vite Admin Page

Provide management functionalities, work with [Basic Service](https://github.com/wwricu/basic-service)

## Hosting

Built and served as a static SPA on Vercel (`admin.wwr.icu`). There is no Caddyfile and no image
here any more - the edge config lives in [wwricu/deploy](https://github.com/wwricu/deploy).

`vercel.ts` proxies every `/api/*` call to `BACKEND_URL`, which is the privileged group on the API
edge: `https://api.wwr.icu/api/admin`. Keeping the call same-origin is what lets the session cookie
(`Domain=wwr.icu`, `SameSite=Lax`) travel without CORS. This app holds no API secret and sends no
credential header - the session cookie is the credential, and the edge decides which group a
visitor may reach at all.

Set `BACKEND_URL` in the Vercel project only if the API edge moves; the default in `vercel.ts` is
the current address.

## Local development

`npm run dev` needs basic-service on `http://localhost:8000`; `vite.config.ts` maps `/api/<x>` to
`/admin/<x>` the same way the edge does. Nothing extra has to be configured: `/admin/*` is answered
by the session check in the service, which is the same code path the browser hits in production.

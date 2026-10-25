# React + TypeScript + Vite Admin Page

Provide management functionalities, work with [Basic Service](https://github.com/wwricu/basic-service)

## Hosting

Built and served as a static SPA on Vercel (`admin.wwr.icu`). There is no Caddyfile and no image
here any more - the edge config lives in [wwricu/deploy](https://github.com/wwricu/deploy).

`vercel.ts` proxies every `/api/*` call to `BACKEND_URL`, which is the privileged group on the API
edge: `https://api.wwr.icu/api/admin`. Keeping the call same-origin is what lets the session cookie
(`Domain=wwr.icu`, `SameSite=Lax`) travel without CORS, and Caddy - not this app - is the one that
adds `X-Internal-Token`, so the browser never sees or needs that secret.

Set `BACKEND_URL` in the Vercel project only if the API edge moves; the default in `vercel.ts` is
the current address.

## Local development

`npm run dev` needs basic-service on `http://localhost:8000`; `vite.config.ts` maps `/api/<x>` to
`/admin/<x>` the same way the edge does. With `ADMIN_API_TOKEN` unset the service accepts `/admin/*`
locally, which is intentional - the token is an edge concern.

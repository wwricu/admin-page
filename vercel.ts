import { routes, type VercelConfig } from '@vercel/config/v1'

// The edge only exposes the privileged group, so every call from this app goes to /api/admin/*.
const backendUrl = process.env.BACKEND_URL ?? 'https://api.wwr.icu/api/admin'

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite('/api/:match*', `${backendUrl}/:match*`),
    routes.rewrite('/(.*)', '/index.html'),
  ],
}

import { routes, type VercelConfig } from '@vercel/config/v1'

const backendUrl = process.env.BACKEND_URL ?? 'https://api.wwr.icu/api/admin'

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite('/api/:match*', `${backendUrl}/:match*`),
    routes.rewrite('/(.*)', '/index.html'),
  ],
}

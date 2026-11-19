import { routes, type VercelConfig } from '@vercel/config/v1'

const backendUrl = process.env.API_URL
if (!backendUrl) throw new Error('API_URL is not set')

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite('/api/:match*', `${backendUrl}/:match*`),
    routes.rewrite('/(.*)', '/index.html'),
  ],
}

import { routes, type VercelConfig } from '@vercel/config/v1'

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite('/api/:match*', `${process.env.API_URL}/:match*`),
    routes.rewrite('/(.*)', '/index.html'),
  ],
}

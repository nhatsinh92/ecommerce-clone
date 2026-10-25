const API_ORIGIN = 'http://127.0.0.1:4000'

/** @type {import('next').NextConfig} */
module.exports = {
  env: { API_ORIGIN },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_ORIGIN}/:path*` }]
  },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://your-backend-url.com/api/:path*'
          : 'http://localhost:3000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig

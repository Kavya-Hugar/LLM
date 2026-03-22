/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
  trailingSlash: {
    source: false,
    regions: ['asia-southeast1', 'asia-southeast2'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? process.env.API_URL + '/api/:path*'
          : 'http://localhost:3000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig

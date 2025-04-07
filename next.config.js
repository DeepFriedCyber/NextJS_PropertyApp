/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    scrollRestoration: true,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable SWC minification
  swcMinify: true,
  // Configure webpack
  webpack: (config, { dev, isServer }) => {
    // Disable caching in development
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;

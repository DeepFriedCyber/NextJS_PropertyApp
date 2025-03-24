/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.(svg|png|jpg|jpeg|gif|ico)$/,
      use: ['@svgr/webpack', 'url-loader'],
    });
    return config;
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["your-supabase-storage-url.com", "cloudinary.com"], // Add your image hosts
  },
};

module.exports = nextConfig;

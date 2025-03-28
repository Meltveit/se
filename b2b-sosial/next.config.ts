/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com'
    ],
  },
  // For production deployment
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com'
    ],
  },
  // Allow importing CSS from node_modules
  transpilePackages: ['react-quill'],
  // For production deployment
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
};

module.exports = nextConfig;
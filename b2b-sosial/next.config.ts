/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // This is important for static exports
  transpilePackages: ['react-quill'],
};

module.exports = nextConfig;
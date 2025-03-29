/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Endre output til export for å generere statiske filer
  output: 'export',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['react-quill'],
};

module.exports = nextConfig;
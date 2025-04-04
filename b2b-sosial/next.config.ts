import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['react-quill'],
  
  // Environment variables to be set at build time
  env: {
    // Disable remote config during build
    NEXT_PUBLIC_DISABLE_REMOTE_CONFIG: 'true',
  },
  
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Use a type assertion to bypass the type checking
      (config.resolve as any).fallback = {
        ...(config.resolve as any).fallback,
        fs: false,
        net: false,
        tls: false,
        // Add Remote Config related modules to fallback
        'firebase-admin': false,
        '@firebase/remote-config': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
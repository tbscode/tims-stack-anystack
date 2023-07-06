/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-syntax-highlighter'],
  reactStrictMode: true,
  trailingSlash: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true, // enabling this will enable SSR for Tailwind
  },
};

module.exports = nextConfig;

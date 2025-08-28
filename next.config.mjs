/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  distDir: '.next',
  trailingSlash: true,
  experimental: {
    outputFileTracing: true,
    outputFileTracingRoot: process.cwd()
  }
};

export default nextConfig;
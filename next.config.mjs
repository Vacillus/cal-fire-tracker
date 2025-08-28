/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily remove 'export' to generate server files
  // output: 'export',
  images: {
    unoptimized: true
  },
  distDir: '.next',
  trailingSlash: true,
  experimental: {
    outputFileTracing: true,
    outputFileTracingRoot: process.cwd(),
    outputStandalone: true
  }
};

export default nextConfig;
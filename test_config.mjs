// TEST CONFIG - With experimental.outputFileTracing
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  distDir: '.next',
  experimental: {
    outputFileTracing: true,
    outputFileTracingRoot: process.cwd()
  },
  generateBuildId: () => 'static-build',
  poweredByHeader: false,
  compress: false,
  generateEtags: false,
  trailingSlash: true
};

export default nextConfig;
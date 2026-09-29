import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  agentRules: false,
};

export default nextConfig;

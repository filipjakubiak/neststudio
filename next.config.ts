import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  // next dev nie dopisuje bloku agent rules do CLAUDE.md
  agentRules: false,
};

export default nextConfig;

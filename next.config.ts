import type { NextConfig } from "next";
import { runtime } from "./app/page";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    runtime: "edge",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

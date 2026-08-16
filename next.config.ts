import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Allow hot reloading when viewing on mobile via local network
  allowedDevOrigins: ['192.168.1.10', '172.20.10.3'],
};

export default nextConfig;


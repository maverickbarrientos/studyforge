import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["officeparser"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

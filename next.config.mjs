/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Allow product photo uploads from the admin page (default limit is 1 MB)
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

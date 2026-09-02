import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Ngrok origin to prevent Next.js from blocking HMR (which breaks React interactivity)
  // Note: if your ngrok url changes, update this string!
  allowedDevOrigins: [
    'unperceptually-unregurgitated-chuck.ngrok-free.dev',
    'localhost:3000',
    'localhost:3001'
  ],
};

export default nextConfig;

import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
};

// Only use PWA plugin in production to avoid Turbopack conflicts
const isDev = process.env.NODE_ENV === "development";

export default isDev ? nextConfig : withPWA(nextConfig);

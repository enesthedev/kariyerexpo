import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // React <ViewTransition> + browser View Transitions on navigations and
  // startTransition updates (see the VT recipes in app/globals.css).
  experimental: { viewTransition: true },
}

export default nextConfig

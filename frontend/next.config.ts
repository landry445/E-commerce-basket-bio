import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
const u = new URL(API_URL);

// narrowing explicite pour satisfaire le type RemotePattern
const proto = u.protocol === "https:" ? "https" : ("http" as "http" | "https");
const portStr: string | undefined = u.port || undefined;
const apiOrigin = `${u.protocol}//${u.hostname}${u.port ? `:${u.port}` : ""}`;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: proto,
        hostname: u.hostname,
        ...(portStr ? { port: portStr } : {}),
      },
    ],
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiOrigin}/:path*` }];
  },
};

export default nextConfig;

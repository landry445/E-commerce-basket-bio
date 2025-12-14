import type { NextConfig } from "next";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.lejardindesrainettes.fr";
const u = new URL(API_URL);

const proto = u.protocol === "https:" ? "https" : ("http" as "http" | "https");
const portStr: string | undefined = u.port || undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: proto,
        hostname: u.hostname,
        ...(portStr ? { port: portStr } : {}),
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;

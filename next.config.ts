import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "via.placeholder.com",
            },
            {
                protocol: "https",
                hostname: "instagram.com",
            },
            {
                protocol: "https",
                hostname: "scontent.cdninstagram.com",
            },
        ],
    },
    experimental: {
        turbo: {
            resolveAlias: {
                canvas: "./empty-module.ts",
            },
        },
    },
};

export default nextConfig;

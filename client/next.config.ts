import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    async redirects() {
        return [
            {
                source: "/panel",
                destination: "/panel/application",
                permanent: true, // Set to false for a temporary redirect
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/outreach-service/:path*",
                destination: "https://dev.hackcc.net/outreach-service/:path*",
            },
        ];
    },
};

export default nextConfig;

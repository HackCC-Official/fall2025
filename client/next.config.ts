import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    images: {
        domains: [
          'hackcc.net',
          'dev.hackcc.net',
          'minio.hackcc.net'
        ]
      },
};

export default nextConfig;
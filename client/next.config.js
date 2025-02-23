/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/outreach-service/:path*",
                destination: "https://dev.hackcc.net/outreach-service/:path*",
            },
        ];
    },
};

module.exports = nextConfig; 
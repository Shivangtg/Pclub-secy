/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'imgs.search.brave.com',
            },
        ],
    },
};

export default nextConfig;

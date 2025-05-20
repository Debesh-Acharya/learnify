import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'b.thumbs.redditmedia.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.thumbs.redditmedia.com',
        pathname: '/**',
      },
      // Add other Reddit domains you might encounter
      {
        protocol: 'https',
        hostname: 'preview.redd.it',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.redd.it',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.redditstatic.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

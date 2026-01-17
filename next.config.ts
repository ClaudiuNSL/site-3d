import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configurare pentru fișiere mari (imagini și video)
  experimental: {
    // Permite body size mai mare pentru upload-uri
    serverActions: {
      bodySizeLimit: '50mb', // Crescut la 50MB
    },
  },
};

export default nextConfig;

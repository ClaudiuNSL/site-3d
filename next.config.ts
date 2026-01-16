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
      bodySizeLimit: '100mb', // Limită de 100MB pentru upload-uri
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "100.100.111.59",
    "100.100.111.59:3000",
    "100.116.192.50",
    "100.116.192.50:3000",
    "100.71.160.33",
    "100.71.160.33:3000",
    "cachyos-dl3420-1",
    "cachyos-dl3420-1:3000",
    "cachyos-dl3420-1.tail982ab0.ts.net",
    "cachyos-dl3420-1.tail982ab0.ts.net:3000",
    "cachyos-dl3420",
    "cachyos-dl3420:3000",
    "cachyos-dl3420.tail982ab0.ts.net",
    "cachyos-dl3420.tail982ab0.ts.net:3000",
    "*.tail982ab0.ts.net",
    "*.tail982ab0.ts.net:3000",
    "*.ts.net",
    "*.ts.net:3000",
    "192.168.1.104",
    "192.168.1.104:3000",
    "192.168.1.100",
    "192.168.1.100:3000",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "100.100.111.59",
        "100.100.111.59:3000",
        "100.116.192.50",
        "100.116.192.50:3000",
        "100.71.160.33",
        "100.71.160.33:3000",
        "cachyos-dl3420-1",
        "cachyos-dl3420-1:3000",
        "cachyos-dl3420-1.tail982ab0.ts.net",
        "cachyos-dl3420-1.tail982ab0.ts.net:3000",
        "cachyos-dl3420",
        "cachyos-dl3420:3000",
        "cachyos-dl3420.tail982ab0.ts.net",
        "cachyos-dl3420.tail982ab0.ts.net:3000",
        "*.tail982ab0.ts.net",
        "*.tail982ab0.ts.net:3000",
        "*.ts.net",
        "*.ts.net:3000",
        "192.168.1.104",
        "192.168.1.104:3000",
        "192.168.1.100",
        "192.168.1.100:3000",
      ],
    },
  },
  async headers() {
    return [
      {
        // Terapkan header anti-cache pada seluruh rute aplikasi (kecuali asset static)
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;

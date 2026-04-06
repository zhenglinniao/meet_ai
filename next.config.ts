import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // 统一入口到会议列表页
    return [
      {
        source: "/",
        destination: "/meetings",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

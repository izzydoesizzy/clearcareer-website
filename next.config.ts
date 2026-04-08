import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: ".",
  },
  async redirects() {
    return [
      {
        source: "/blog/build-your-target-company-list-with-chatgpt",
        destination: "/blog/build-your-target-company-list-with-ai",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

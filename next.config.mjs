/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    level: "verbose",
    fetches: {
      fullUrl: true,
    }
  },
  output: "standalone"
};

export default nextConfig;

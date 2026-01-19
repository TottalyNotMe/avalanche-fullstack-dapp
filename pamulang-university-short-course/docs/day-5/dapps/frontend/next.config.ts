// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Memaksa Turbopack/Webpack mencari di direktori saat ini
  experimental: {
    turbo: {
      root: '.',
    },
  },
};

export default nextConfig;
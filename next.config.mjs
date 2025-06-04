import withPWA from 'next-pwa';

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

const pwaConfig = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
});

export default { ...nextConfig, ...pwaConfig };

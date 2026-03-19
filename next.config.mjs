import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  }
};

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true
})(nextConfig);

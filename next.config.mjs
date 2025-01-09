// next.config.mjs
export default {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/books',
          permanent: true,
        },
      ];
    },
  };
  
import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
  latex: false,
  flexsearch: false,
  defaultShowCopyCode: true,
});

export default withNextra({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  rewrites() {
    return [
      {
        source: '/guide',
        destination: '/guide/install',
      },
      {
        source: '/docs',
        destination: '/docs/exports',
      },
    ];
  },
});

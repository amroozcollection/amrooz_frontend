/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle (.next/standalone) — this is what the
  // GitHub Actions deploy uploads to Hostinger.
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.amroozcollection.com/api',
  },

  // Content negotiation for AI agents: the same page URLs answer with Markdown
  // when the request says "Accept: text/markdown" (served by app/md).
  async rewrites() {
    const markdown = [{ type: 'header', key: 'accept', value: '.*text/markdown.*' }];
    return {
      beforeFiles: [
        { source: '/', has: markdown, destination: '/md' },
        { source: '/products', has: markdown, destination: '/md/products' },
        { source: '/products/:id', has: markdown, destination: '/md/products/:id' },
        { source: '/contact', has: markdown, destination: '/md/contact' },
      ],
    };
  },

  async headers() {
    return [
      {
        // RFC 8288 Link header: where agents can find the machine-readable
        // description, the Markdown alternate and the sitemap.
        source: '/',
        headers: [
          {
            key: 'Link',
            value:
              '</llms.txt>; rel="describedby"; type="text/plain", ' +
              '</md>; rel="alternate"; type="text/markdown", ' +
              '</sitemap.xml>; rel="sitemap"; type="application/xml"',
          },
        ],
      },
      // The same URL can return HTML or Markdown, so caches must key on Accept.
      ...['/', '/products', '/products/:id', '/contact'].map((source) => ({
        source,
        headers: [{ key: 'Vary', value: 'Accept' }],
      })),
    ];
  },
};

module.exports = nextConfig;

import '@/app/globals.css';
import { Playfair_Display, Inter } from 'next/font/google';
import SiteChrome from '@/components/layout/SiteChrome';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = 'https://amroozcollection.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Amrooz Collection — Premium Clothing & Fashion',
  description:
    'Discover premium, thoughtfully crafted clothing at Amrooz Collection. Timeless style, modern comfort.',
  // './' resolves to each page's own URL, so every page declares itself canonical.
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: 'Amrooz Collection',
    locale: 'en_PK',
    images: ['/logo.png'],
  },
};

// Organization + WebSite structured data, rendered on every page.
const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Amrooz Collection',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description:
      'Pakistani clothing brand offering premium women’s clothing, stylish dresses, unstitched suits and elegant ethnic wear.',
    email: 'support@amroozcollection.com',
    telephone: '+92-315-4047963',
    areaServed: 'PK',
    // Online-only store. Add streetAddress / addressLocality once a real
    // business address is confirmed — never guessed.
    address: { '@type': 'PostalAddress', addressCountry: 'PK' },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: '+92-315-4047963',
        email: 'support@amroozcollection.com',
        areaServed: 'PK',
        availableLanguage: ['en', 'ur'],
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Amrooz Collection',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

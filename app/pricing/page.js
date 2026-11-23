import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { getCatalog, formatRs, offerFor, productImages, SITE_URL } from '@/lib/catalog';

export const metadata = {
  title: 'Pricing — Amrooz Collection',
  description:
    'Current prices for every Amrooz Collection piece, in Pakistani rupees (PKR). Delivery within Pakistan; pay by card, mobile wallet or cash on delivery.',
};

// Render per request (data itself is cached for 5 minutes) so a slow API during
// `next build` can never bake an empty price list into the page.
export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const products = await getCatalog();

  const schema = products.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/products/${p.id}#product`,
    name: p.name,
    url: `${SITE_URL}/products/${p.id}`,
    sku: p.sku || undefined,
    image: productImages(p),
    brand: { '@type': 'Brand', name: p.brand || 'Amrooz Collection' },
    offers: offerFor(p),
  }));

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-24">
      {schema.length > 0 && <JsonLd data={schema} />}
      <p className="eyebrow text-accent-dark">Pricing</p>
      <h1 className="mt-2 font-serif text-4xl text-primary">Our prices</h1>
      <p className="mt-4 text-primary/70">
        All prices are in Pakistani rupees (PKR). Delivery is available across Pakistan and you can
        pay by card, mobile wallet or cash on delivery. See{' '}
        <Link href="/shipping" className="underline hover:text-accent-dark">shipping</Link> and{' '}
        <Link href="/returns" className="underline hover:text-accent-dark">returns</Link> for details.
      </p>

      {products.length === 0 ? (
        <p className="mt-10 text-primary/60">Prices are temporarily unavailable. Please check back shortly.</p>
      ) : (
        <div className="mt-10 overflow-hidden rounded-2xl border border-primary/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wide text-primary/60">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-4">
                    <Link href={`/products/${p.id}`} className="font-medium text-primary hover:text-accent-dark">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-primary">
                    {formatRs(p.price)}
                    {p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price) && (
                      <span className="ml-2 text-primary/40 line-through">{formatRs(p.compareAtPrice)}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-primary/70">{p.stock > 0 ? 'In stock' : 'Out of stock'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

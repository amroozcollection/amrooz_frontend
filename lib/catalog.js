// Server-side catalogue helpers for SEO / agent-facing output (structured data,
// Markdown, llms.txt). Real API data only — sample products are never published.
const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.amroozcollection.com/api';

export const SITE_URL = 'https://amroozcollection.com';

const https = (u) => (typeof u === 'string' ? u.replace(/^http:\/\//, 'https://') : u);

export async function getCatalog() {
  // One retry: the shared host is occasionally slow, and an empty list would
  // otherwise show "prices unavailable" until the cache refreshes.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetch(`${API}/products`, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      const active = list.filter((p) => p && p.id != null && p.isActive !== false);
      if (active.length > 0) return active;
    } catch {
      // try again
    }
  }
  return [];
}

export async function getCatalogProduct(id) {
  try {
    const res = await fetch(`${API}/products/${encodeURIComponent(id)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const p = await res.json();
    return p && p.id != null ? p : null;
  } catch {
    return null;
  }
}

export const formatRs = (n) =>
  `Rs ${Number(n).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

/** schema.org Offer for a product (price in PKR). */
export function offerFor(p) {
  const price = Number(p.price);
  if (!Number.isFinite(price)) return undefined;
  return {
    '@type': 'Offer',
    url: `${SITE_URL}/products/${p.id}`,
    priceCurrency: 'PKR',
    price: price.toFixed(2),
    availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
  };
}

export function productImages(p) {
  return (p.images?.length ? p.images : [p.imageUrl]).filter(Boolean).map(https);
}

import { notFound } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';
import RelatedProducts from '@/components/products/RelatedProducts';
import { fetchProduct, fetchProducts } from '@/lib/products';
import { htmlToPlainText } from '@/lib/richText';
import JsonLd from '@/components/seo/JsonLd';

// Next 15: dynamic route `params` is async and must be awaited.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: product } = await fetchProduct(id);

  if (!product) {
    return { title: 'Product Not Found — Amrooz Collection' };
  }

  const description =
    htmlToPlainText(product.shortDescription) ||
    htmlToPlainText(product.description) ||
    undefined;

  return {
    title: `${product.name} — Amrooz Collection`,
    description,
    openGraph: product.imageUrl
      ? { images: [{ url: product.imageUrl }] }
      : undefined,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const { data: product } = await fetchProduct(id);

  if (!product) notFound();

  const { data: sameCategory } = await fetchProducts(product.category);
  const related = sameCategory
    .filter((p) => String(p.id) !== String(product.id))
    .slice(0, 4);

  const SITE = 'https://amroozcollection.com';
  const https = (u) => (typeof u === 'string' ? u.replace(/^http:\/\//, 'https://') : u);
  const price = Number(product.price);
  const images = (product.images?.length ? product.images : [product.imageUrl]).filter(Boolean).map(https);
  const description =
    htmlToPlainText(product.shortDescription) || htmlToPlainText(product.description) || undefined;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE}/products/${product.id}#product`,
    name: product.name,
    description,
    sku: product.sku || undefined,
    image: images.length ? images : undefined,
    brand: { '@type': 'Brand', name: product.brand || 'Amrooz Collection' },
    category: product.categoryName || undefined,
    url: `${SITE}/products/${product.id}`,
    offers: Number.isFinite(price)
      ? {
          '@type': 'Offer',
          url: `${SITE}/products/${product.id}`,
          priceCurrency: 'PKR',
          price: price.toFixed(2),
          availability:
            product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'Amrooz Collection' },
        }
      : undefined,
    // Only published when real customer reviews exist.
    aggregateRating:
      product.reviewCount > 0 && Number(product.rating) > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(product.rating),
            reviewCount: Number(product.reviewCount),
          }
        : undefined,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE}/products/${product.id}` },
    ],
  };

  return (
    <>
      <JsonLd data={[productSchema, breadcrumbSchema]} />
      <ProductDetail product={product} />
      <RelatedProducts products={related} />
    </>
  );
}

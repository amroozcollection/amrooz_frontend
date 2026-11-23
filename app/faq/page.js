import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'FAQ — Amrooz Collection',
  description: 'Frequently asked questions.',
};

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Delivery typically takes 2-7 business days depending on your location in Pakistan.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Currently, we only ship within Pakistan.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer 30-day returns on unworn items with tags attached. See our Returns page for details.',
  },
  {
    q: 'How do I track my order?',
    a: 'Use our Track Your Order page with your order number and email address.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept credit/debit cards, mobile wallets, and cash on delivery.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-24">
      <JsonLd data={faqSchema} />
      <h1 className="font-serif text-4xl text-primary">Frequently Asked Questions</h1>
      <div className="mt-8 space-y-8">
        {FAQS.map(({ q, a }) => (
          <div key={q}>
            <h3 className="font-serif text-xl text-primary">{q}</h3>
            <p className="mt-2 text-primary/80">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

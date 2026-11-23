import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import { HeadsetIcon, MailIcon, RefreshIcon, ArrowRightIcon } from '@/components/ui/Icons';

export const metadata = {
  title: 'Contact Us — Amrooz Collection',
  description:
    'Reach the Amrooz Collection team by phone, WhatsApp or email. We reply Monday to Saturday, 9:00 AM – 6:00 PM PKT.',
};

const PHONE_DISPLAY = '0315 4047963';
const PHONE_TEL = '+923154047963';
const WHATSAPP_URL = 'https://wa.me/923154047963';

const CHANNELS = [
  {
    Icon: HeadsetIcon,
    title: 'Call or WhatsApp',
    text: 'Fastest way to reach us for order and sizing questions.',
    label: PHONE_DISPLAY,
    href: `tel:${PHONE_TEL}`,
    extra: { label: 'Chat on WhatsApp', href: WHATSAPP_URL },
  },
  {
    Icon: MailIcon,
    title: 'Customer Support',
    text: 'Orders, deliveries, returns and exchanges.',
    label: 'support@amroozcollection.com',
    href: 'mailto:support@amroozcollection.com',
  },
  {
    Icon: MailIcon,
    title: 'Business Inquiries',
    text: 'Collaborations, wholesale and press.',
    label: 'info@amroozcollection.com',
    href: 'mailto:info@amroozcollection.com',
  },
];

const HOURS = [
  { days: 'Monday – Saturday', time: '9:00 AM – 6:00 PM' },
  { days: 'Sunday', time: 'Closed' },
];

export default function ContactPage() {
  return (
    <div className="bg-secondary">
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 lg:px-8 lg:pt-24">
        <SectionHeading
          eyebrow="Contact"
          title="We'd love to hear from you"
          description="Questions about an order, a size or a piece you love? Our team is happy to help."
        />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {CHANNELS.map(({ Icon, title, text, label, href, extra }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-primary/10 bg-white p-7 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft/60 text-accent-dark">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-serif text-xl text-primary">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-primary/60">{text}</p>
              <a
                href={href}
                className="mt-5 break-all text-sm font-medium text-primary underline-offset-4 hover:text-accent-dark hover:underline"
              >
                {label}
              </a>
              {extra && (
                <a
                  href={extra.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-dark hover:underline"
                >
                  {extra.label} <ArrowRightIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8 lg:pb-28">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-primary p-8 text-secondary lg:p-10">
            <p className="eyebrow text-accent">Opening hours</p>
            <h2 className="mt-3 font-serif text-2xl">When we&apos;re available</h2>
            <dl className="mt-6 divide-y divide-secondary/15">
              {HOURS.map(({ days, time }) => (
                <div key={days} className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-secondary/70">{days}</dt>
                  <dd className="font-medium">{time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-secondary/50">All times are Pakistan Standard Time (PKT).</p>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-8 lg:p-10">
            <p className="eyebrow text-accent-dark">Quick answers</p>
            <h2 className="mt-3 font-serif text-2xl text-primary">Looking for something specific?</h2>
            <ul className="mt-6 space-y-3">
              {[
                { href: '/track', label: 'Track your order' },
                { href: '/returns', label: 'Returns & exchanges' },
                { href: '/faq', label: 'Frequently asked questions' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between rounded-xl border border-primary/10 px-4 py-3 text-sm font-medium text-primary transition hover:border-accent hover:bg-secondary"
                  >
                    <span className="flex items-center gap-3">
                      <RefreshIcon className="h-4 w-4 text-accent-dark" />
                      {label}
                    </span>
                    <ArrowRightIcon className="h-4 w-4 text-primary/40 transition group-hover:translate-x-0.5 group-hover:text-accent-dark" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

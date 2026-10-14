import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock,
  Gift,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  X,
} from 'lucide-react'
import { Reveal, SectionHeading, Stars } from './shared'
import { openWhatsappCheckout } from '../services/whatsappCheckout.service'
function InstagramIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function FacebookIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function YoutubeIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}
import { faqs, inr, testimonials, type Product } from '../data'
/* ---------- TESTIMONIALS ---------- */
export function Testimonials() {
  return (
    <section
      id="reviews"
      className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <SectionHeading
        eyebrow="38,400+ verified reviews"
        title={
          <>
            Women 25–45{' '}
            <span className="text-gold-gradient italic">
              can't stop talking.
            </span>
          </>
        }
        copy="Unfiltered words from office-goers, new moms, brides and garba queens. All reviews from verified prepaid + COD orders."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 0.08}>
            <figure className="card-lift relative flex h-full flex-col rounded-[26px] border border-maroon-800/10 bg-white p-6 shadow-[0_18px_45px_-24px_rgba(74,14,28,0.35)]">
              <Quote
                className="absolute right-5 top-5 h-7 w-7 text-gold-500/25"
                aria-hidden
              />
              <div className="flex items-center gap-1">
                <Stars />
                <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  Verified
                </span>
              </div>
              <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-[#4a2b33]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-maroon-800/10 pt-4">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${t.gradient} text-[14px] font-bold text-white shadow`}
                >
                  {t.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-[14px] font-bold text-maroon-950">
                    {t.name}{' '}
                    <BadgeCheck
                      className="h-3.5 w-3.5 text-sky-600"
                      aria-label="Verified buyer"
                    />
                  </span>
                  <span className="block truncate text-[12px] text-[#8a6a73]">
                    {t.age} • bought {t.product}
                  </span>
                </span>
                <span className="ml-auto shrink-0 rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-maroon-700">
                  {t.tag}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8">
        <div className="flex flex-col items-center justify-center gap-3 rounded-[26px] border border-gold-500/25 bg-gradient-to-r from-[#fff8e8] via-white to-[#fff8e8] px-6 py-6 text-center sm:flex-row sm:gap-6">
          <p className="text-[14px] font-medium text-maroon-900">
            <strong className="font-bold">4.9/5 average</strong> • 92% say
            “looks premium in person” • 89% repurchase in 90 days
          </p>
          <a
            href="#bestsellers"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-maroon-800 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-maroon-700"
          >
            Join 2L+ women <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
/* ---------- PRICING / CURATED BOXES ---------- */
const boxes = [
  {
    name: 'Everyday Essentials',
    hindi: 'Rozana box',
    price: 1499,
    mrp: 2499,
    per: 'one-time • 3 pieces',
    desc: 'Your desk-to-dinner uniform. Light, office-safe, skin-kind.',
    items: [
      'Meher pendant + chain',
      'Noor mini studs',
      'Anti-tarnish pouch + cloth',
    ],
    cta: 'Build everyday box',
    featured: false,
  },
  {
    name: 'Festive & Navratri Edit',
    hindi: 'Garba box • Most loved',
    price: 2999,
    mrp: 4999,
    per: 'one-time • 5 pieces',
    desc: '9 nights, 5 looks. Mirror, oxidised & AD — mix, match, dance.',
    items: [
      'Mirror choker + maang tikka',
      'Garba jhumkas (2 pairs)',
      'Oxidised bangle stack',
      'Potli + extra back-stoppers',
      'Free express shipping',
    ],
    cta: 'Get festive box',
    featured: true,
  },
  {
    name: 'Royal Bridal Trousseau',
    hindi: 'Dulhan box',
    price: 9999,
    mrp: 15999,
    per: 'one-time • 11 pieces',
    desc: 'Head-to-toe dulhan: choker, rani haar, jhumkas, nath, tikka & more.',
    items: [
      'Kundan choker + rani haar',
      'Jhumkas + nath + maang tikka',
      'Haathphool + bangles + payal',
      'Free stylist video call',
      '15-day bridal exchange',
    ],
    cta: 'Book bridal box',
    featured: false,
  },
]
export function Pricing({
  onAddBox,
}: {
  onAddBox: (name: string, price: number) => void
}) {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-[#fff1de] to-cream-50 py-16 sm:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Curated boxes • Save 40%"
          title={
            <>
              Stop buying singles.{' '}
              <span className="text-gold-gradient italic">
                Start boxing smart.
              </span>
            </>
          }
          copy="One price, complete looks, gift-ready packing. Cheaper than buying separately — and styled by our experts to match each other."
        />
        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
          {boxes.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.1} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-[30px] p-7 transition hover:-translate-y-1.5 duration-500 ${
                  b.featured
                    ? 'bg-maroon-900 text-cream-50 shadow-[0_40px_90px_-25px_rgba(74,14,28,0.7)] ring-2 ring-gold-400'
                    : 'border border-maroon-800/12 bg-white shadow-[0_24px_60px_-28px_rgba(74,14,28,0.4)]'
                }`}
              >
                {b.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-gold-500 to-gold-300 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-maroon-950 shadow-lg">
                    ★ Most loved • 12k+ boxes
                  </span>
                )}
                <p
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] ${b.featured ? 'text-gold-300' : 'text-gold-700'}`}
                >
                  {b.hindi}
                </p>
                <h3
                  className={`font-display mt-1.5 text-[24px] font-semibold ${b.featured ? 'text-white' : 'text-maroon-950'}`}
                >
                  {b.name}
                </h3>
                <p
                  className={`mt-1.5 text-[13.5px] leading-relaxed ${b.featured ? 'text-cream-100/75' : 'text-[#6b4a52]'}`}
                >
                  {b.desc}
                </p>
                <div className="mt-5 flex items-end gap-2">
                  <span
                    className={`font-display text-[40px] font-bold leading-none ${b.featured ? 'text-white' : 'text-maroon-950'}`}
                  >
                    {inr(b.price)}
                  </span>
                  <span
                    className={`pb-1 text-[14px] line-through ${b.featured ? 'text-cream-100/50' : 'text-[#9a7a83]'}`}
                  >
                    {inr(b.mrp)}
                  </span>
                </div>
                <p
                  className={`mt-1 text-[12px] font-medium ${b.featured ? 'text-gold-200' : 'text-[#8a6a73]'}`}
                >
                  {b.per} • COD available
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {b.items.map((it) => (
                    <li
                      key={it}
                      className={`flex items-start gap-2.5 text-[13.5px] font-medium ${b.featured ? 'text-cream-50' : 'text-[#4a2b33]'}`}
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${b.featured ? 'bg-gold-400 text-maroon-950' : 'bg-emerald-100 text-emerald-700'}`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onAddBox(b.name, b.price)}
                  className={`mt-6 w-full rounded-full py-3.5 text-[14px] font-bold transition active:scale-[0.98] ${
                    b.featured
                      ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-maroon-950 shadow-lg shadow-gold-500/30 hover:brightness-105'
                      : 'bg-maroon-800 text-white hover:bg-maroon-700'
                  }`}
                >
                  {b.cta} →
                </button>
                <p
                  className={`mt-3 text-center text-[11.5px] ${b.featured ? 'text-cream-100/60' : 'text-[#9a7a83]'}`}
                >
                  7-day exchange • 6-mo polish warranty
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6 text-center">
          <p className="inline-flex flex-wrap items-center justify-center gap-1.5 text-[13px] text-[#6b4a52]">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> All boxes
            include gift potli, care card & polish cloth
            <span className="mx-1 opacity-30">|</span>{' '}
            <Truck className="h-4 w-4 text-emerald-600" /> Free shipping over
            ₹999
          </p>
        </Reveal>
      </div>
    </section>
  )
}
/* ---------- FAQ ---------- */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Questions? Answered."
        title={
          <>
            Everything women{' '}
            <span className="text-gold-gradient italic">
              ask us before buying.
            </span>
          </>
        }
        copy="Still unsure? WhatsApp us — a real stylist (not a bot) replies in under 5 minutes, 10am–10pm."
      />
      <div className="mt-9 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <Reveal key={f.q} delay={i * 0.04}>
              <div
                className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-gold-500/40 bg-white shadow-[0_20px_50px_-20px_rgba(212,164,55,0.5)]'
                    : 'border-maroon-800/10 bg-white/70 hover:border-maroon-800/25'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="text-[14.5px] font-bold text-maroon-950 sm:text-[15.5px]">
                    {f.q}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${isOpen ? 'rotate-180 bg-maroon-800 text-gold-200' : 'bg-cream-100 text-maroon-800'}`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-[14px] leading-relaxed text-[#6b4a52] sm:px-6">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
/* ---------- CTA with countdown ---------- */
function useCountdown() {
  const target = useMemo(
    () => Date.now() + 1000 * 60 * 60 * 26 + 1000 * 60 * 14,
    [],
  )
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target - now)
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1000)
  return { h, m, s }
}
export function CTA({ onNotify }: { onNotify: (msg: string) => void }) {
  const { h, m, s } = useCountdown()
  const [email, setEmail] = useState('')
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <section
      className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24"
      aria-label="Festive offer"
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-[36px] bg-maroon-950 px-6 py-12 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <img
              src="https://images.pexels.com/photos/17264037/pexels-photo-17264037.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-950/85 to-maroon-900/60" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-500/20 blur-[80px]" />
          </div>
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-maroon-950">
                <Clock className="h-3.5 w-3.5" /> Festive sale ends soon
              </span>
              <h2 className="font-display mt-4 text-3xl font-semibold leading-[1.05] text-white sm:text-5xl">
                Get 20% off + a free{' '}
                <span className="text-gold-gradient italic">
                  jhumka on orders ₹1,999+
                </span>
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-cream-100/75">
                Join 40,000+ women on the Alankar insider list — early Navratri
                drops, secret bridal prices, and style videos for your face
                shape & outfit.
              </p>
              {/* countdown */}
              <div
                className="mt-6 flex items-center gap-2.5"
                role="timer"
                aria-label={`Offer ends in ${h} hours ${m} minutes ${s} seconds`}
              >
                {[
                  { v: pad(h), l: 'hrs' },
                  { v: pad(m), l: 'min' },
                  { v: pad(s), l: 'sec' },
                ].map((u, i) => (
                  <span key={u.l} className="flex items-center gap-2.5">
                    <span className="min-w-[68px] rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 text-center backdrop-blur">
                      <span className="font-display block text-2xl font-bold tabular-nums text-gold-300">
                        {u.v}
                      </span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-cream-100/60">
                        {u.l}
                      </span>
                    </span>
                    {i < 2 && (
                      <span className="font-display text-xl text-gold-500">
                        :
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] glass p-6 sm:p-7">
              <h3 className="font-display text-xl font-semibold text-maroon-950">
                Claim your ₹300 welcome voucher
              </h3>
              <p className="mt-1 text-[13px] text-[#6b4a52]">
                On your first order over ₹999. No spam — only drops & offers.
              </p>
              <form
                className="mt-4 space-y-2.5"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!email.includes('@')) {
                    onNotify('Please enter a valid email 💛')
                    return
                  }
                  onNotify('Welcome to Alankar! Your ₹300 code: NAMASTE300 ✨')
                  setEmail('')
                }}
              >
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="cta-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-maroon-800/15 bg-white px-4 py-3.5 text-[14px] text-maroon-950 placeholder:text-[#b49aa1] focus:border-gold-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-maroon-800 py-3.5 text-[14.5px] font-bold text-white shadow-lg transition hover:bg-maroon-700 active:scale-[0.99]"
                >
                  Send my ₹300 voucher{' '}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <a
                  href="https://wa.me/919586171580"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#1faa55] py-3 text-[13px] font-bold text-white transition hover:brightness-105"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp us
                </a>
                <a
                  href="tel:+919586171580"
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-maroon-800/20 bg-white py-3 text-[13px] font-bold text-maroon-900 transition hover:bg-cream-100"
                >
                  <Phone className="h-4 w-4" /> Call stylist
                </a>
              </div>
              <p className="mt-3 text-center text-[11.5px] text-[#8a6a73]">
                By joining you agree to WhatsApp + email updates. Unsubscribe
                anytime.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
/* ---------- FOOTER ---------- */
export function Footer({ onNotify }: { onNotify: (m: string) => void }) {
  const [em, setEm] = useState('')
  return (
    <footer className="relative overflow-hidden bg-maroon-950 text-cream-100">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-maroon-950 shadow-lg">
                <Sparkles className="h-5 w-5" />
              </span>
              <span>
                <span className="font-display block text-2xl font-bold text-white">
                  Alankar
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-300">
                  Jewellery • India
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-cream-100/65">
              Premium artificial jewellery for daily wear, fashion, weddings &
              Navratri. Designed in Mumbai, hand-finished by 40+ artisan
              families.
            </p>
            <form
              className="mt-5 flex max-w-xs gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (em.includes('@')) {
                  onNotify('Subscribed! Check your inbox 💌')
                  setEm('')
                } else onNotify('Enter a valid email 💛')
              }}
            >
              <label htmlFor="foot-email" className="sr-only">
                Email for newsletter
              </label>
              <input
                id="foot-email"
                type="email"
                value={em}
                onChange={(e) => setEm(e.target.value)}
                placeholder="Email for drops"
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-[13px] placeholder:text-cream-100/40 focus:border-gold-400 focus:outline-none"
              />
              <button
                className="shrink-0 rounded-full bg-gold-400 px-4 py-2.5 text-[13px] font-bold text-maroon-950 hover:bg-gold-300"
                aria-label="Subscribe"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-5 flex gap-2">
              {[
                { icon: InstagramIcon, l: 'Instagram' },
                { icon: FacebookIcon, l: 'Facebook' },
                { icon: YoutubeIcon, l: 'YouTube' },
              ].map((s) => (
                <a
                  key={s.l}
                  href="#top"
                  aria-label={s.l}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 transition hover:bg-gold-400 hover:text-maroon-950"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              {
                h: 'Shop',
                links: [
                  'Daily Wear',
                  'Fashion & Party',
                  'Wedding & Bridal',
                  'Navratri Edit',
                  'Gift Cards',
                  'Combos & Boxes',
                ],
              },
              {
                h: 'Help',
                links: [
                  'Track Order',
                  'Shipping & COD',
                  '7-Day Exchange',
                  'Jewellery Care',
                  'Size Guide',
                  'Contact Us',
                ],
              },
              {
                h: 'Company',
                links: [
                  'Our Story',
                  'Karigar Partners',
                  'Reviews',
                  'Wholesale',
                  'Careers',
                  'Press',
                ],
              },
              {
                h: 'Contact',
                links: [
                  'Shreeji Artificial Jewellery',
                  '+91 95861 71580',
                  '10am–10pm, all days',
                ],
              },
            ].map((col) => (
              <nav key={col.h} aria-label={col.h}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">
                  {col.h}
                </h3>
                <ul className="mt-3.5 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#top"
                        className="text-[13.5px] text-cream-100/65 transition hover:text-white"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
                {col.h === 'Contact' && (
                  <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-relaxed text-cream-100/50">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> 102, shop
                    2, Saraswat Nagar Society, Piplod Main Road, Near Someshwar
                    Circle, Vesu, Surat 395007
                  </p>
                )}
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[12px] text-cream-100/50">
            © 2026 Alankar Jewels Pvt. Ltd. • Made with love in India •
            BIS-hallmarked processes
          </p>
          <div className="flex items-center gap-2" aria-label="Payment methods">
            {['UPI', 'Visa', 'MC', 'COD'].map((p) => (
              <span
                key={p}
                className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-cream-100/80"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
/* ---------- CART DRAWER ---------- */
/** Block 9: `sku` rides along in the bag so the WhatsApp order names it. Optional
 *  because the curated combo boxes (Pricing section) are not database products. */
export type CartItem = {
  id: string
  sku?: string
  name: string
  price: number
  image: string
  qty: number
}
export function CartDrawer({
  open,
  items,
  onClose,
  onQty,
  onRemove,
}: {
  open: boolean
  items: CartItem[]
  onClose: () => void
  onQty: (id: string, d: number) => void
  onRemove: (id: string) => void
}) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const freeShip = total >= 999
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-maroon-950/50 backdrop-blur-sm"
            aria-hidden
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-maroon-800/10 px-5 py-4">
              <h2 className="font-display text-xl font-semibold text-maroon-950">
                Your Bag ({items.reduce((s, i) => s + i.qty, 0)})
              </h2>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full bg-maroon-800/5 hover:bg-maroon-800/10"
                aria-label="Close bag"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="border-b border-maroon-800/10 bg-white px-5 py-3">
              <div className="h-2 overflow-hidden rounded-full bg-cream-200">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-maroon-700 to-gold-500"
                  animate={{ width: `${Math.min(100, (total / 999) * 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[12px] font-medium text-maroon-900">
                {freeShip ? (
                  "🎉 You've unlocked FREE shipping + gift potli!"
                ) : (
                  <>
                    Add <strong>{inr(999 - total)}</strong> more for free
                    shipping
                  </>
                )}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-cream-200 text-maroon-800">
                    <ShoppingBag className="h-7 w-7" />
                  </span>
                  <p className="font-display mt-4 text-xl font-semibold text-maroon-950">
                    Your bag is empty
                  </p>
                  <p className="mt-1 max-w-[240px] text-[13px] text-[#8a6a73]">
                    Beautiful things are waiting. Start with our bestsellers?
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 rounded-full bg-maroon-800 px-6 py-3 text-[13px] font-bold text-white"
                  >
                    Explore bestsellers
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={it.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-3 rounded-2xl border border-maroon-800/10 bg-white p-3"
                      >
                        <img
                          src={it.image}
                          alt=""
                          className="h-20 w-16 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-bold text-maroon-950">
                            {it.name}
                          </p>
                          <p className="text-[13px] font-semibold text-maroon-800">
                            {inr(it.price)}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-maroon-800/15 px-1.5 py-1">
                              <button
                                onClick={() => onQty(it.id, -1)}
                                className="grid h-6 w-6 place-items-center rounded-full hover:bg-cream-100"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-4 text-center text-[13px] font-bold">
                                {it.qty}
                              </span>
                              <button
                                onClick={() => onQty(it.id, 1)}
                                className="grid h-6 w-6 place-items-center rounded-full hover:bg-cream-100"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => onRemove(it.id)}
                              className="grid h-8 w-8 place-items-center rounded-full text-[#b07884] hover:bg-red-50 hover:text-red-600"
                              aria-label={`Remove ${it.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-maroon-800/10 bg-white px-5 py-4">
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#6b4a52]">Subtotal</span>
                  <strong className="text-maroon-950">{inr(total)}</strong>
                </div>
                <div className="mt-1 flex justify-between text-[13px]">
                  <span className="text-[#6b4a52]">Shipping</span>
                  <span className="font-semibold text-emerald-600">
                    {freeShip ? 'FREE' : inr(79)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    // Block 9 — the core wiring: build the order message from the
                    // bag and open wa.me. Total matches this button (subtotal +
                    // shipping below the free-ship bar).
                    openWhatsappCheckout(items, total + (freeShip ? 0 : 79), {
                      shipping: freeShip ? 0 : 79,
                    })
                  }}
                  className="mt-3 w-full rounded-full bg-maroon-800 py-3.5 text-[14px] font-bold text-white shadow-lg transition hover:bg-maroon-700 active:scale-[0.99]"
                >
                  Checkout securely • {inr(total + (freeShip ? 0 : 79))} (COD
                  available)
                </button>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-[11.5px] text-[#8a6a73]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Order
                  sent to us on WhatsApp • 7-day exchange • UPI / Cards / COD
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
/* ---------- QUICK VIEW MODAL ---------- */
export function QuickView({
  product,
  products,
  wished,
  onClose,
  onAdd,
  onWish,
}: {
  // Block 6: `products` (the live catalogue) feeds the "Complete the look"
  // strip — it used to read the static data.ts array.
  product: Product | null
  products: Product[]
  wished: boolean
  onClose: () => void
  onAdd: (p: Product) => void
  onWish: (id: string) => void
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[62] grid place-items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-maroon-950/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl sm:grid-cols-2"
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
          >
            <div className="relative max-h-72 overflow-hidden sm:max-h-none">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-maroon-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-200">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="overflow-y-auto p-6 sm:p-7">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-maroon-800/5 hover:bg-maroon-800/10"
                aria-label="Close quick view"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-700">
                {product.categoryName} • Alankar
              </p>
              <h3 className="font-display mt-1.5 text-2xl font-semibold leading-tight text-maroon-950">
                {product.name}
              </h3>
              {/* Ratings only render when the backend has them — never invented numbers. */}
              {product.rating != null && (
                <div className="mt-2 flex items-center gap-2">
                  <Stars />
                  <span className="text-[13px] font-bold">
                    {product.rating}
                  </span>
                  {product.reviews != null && (
                    <span className="text-[12px] text-[#9a7a83]">
                      {product.reviews.toLocaleString('en-IN')} reviews
                    </span>
                  )}
                </div>
              )}
              <p className="mt-3 text-[14px] leading-relaxed text-[#6b4a52]">
                {product.blurb} Skin-safe, tarnish-resistant, with free potli &
                care card. Styled for Indian skin tones & outfits.
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-maroon-900">
                  {inr(product.price)}
                </span>
                <span className="text-[15px] text-[#9a7a83] line-through">
                  {inr(product.mrp)}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[12px] font-bold text-emerald-700">
                  Save {inr(product.mrp - product.price)}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[12.5px] text-[#6b4a52]">
                <Truck className="h-4 w-4 text-emerald-600" /> Dispatch in 24
                hrs • COD available
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => {
                    onAdd(product)
                    onClose()
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-maroon-800 py-3.5 text-[14px] font-bold text-white hover:bg-maroon-700"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Bag
                </button>
                <button
                  onClick={() => onWish(product.id)}
                  aria-pressed={wished}
                  aria-label="Toggle wishlist"
                  className={`grid h-[52px] w-[52px] place-items-center rounded-full border transition ${wished ? 'border-blush-500 bg-blush-500 text-white' : 'border-maroon-800/20 text-maroon-900 hover:bg-cream-100'}`}
                >
                  <Heart
                    className={`h-5 w-5 ${wished ? 'fill-current' : ''}`}
                  />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  ['7-day', 'exchange'],
                  ['6-month', 'warranty'],
                  ['COD', 'available'],
                ].map(([a, b]) => (
                  <div key={b} className="rounded-2xl bg-cream-100 px-2 py-2.5">
                    <p className="text-[13px] font-bold text-maroon-900">{a}</p>
                    <p className="text-[11px] text-[#8a6a73]">{b}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-[13px] font-bold text-maroon-950">
                  Complete the look
                </p>
                <div className="mt-2 flex gap-2">
                  {products
                    .filter((p) => p.id !== product.id)
                    .slice(0, 3)
                    .map((p) => (
                      <img
                        key={p.id}
                        src={p.image}
                        alt=""
                        loading="lazy"
                        className="h-16 w-14 rounded-xl object-cover ring-1 ring-maroon-800/10"
                      />
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
/* ---------- TOAST + BACK TO TOP ---------- */
export function Toast({ msg }: { msg: string | null }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          className="fixed bottom-5 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md items-center gap-2.5 rounded-2xl bg-maroon-950 px-4 py-3.5 text-[13.5px] font-medium text-cream-50 shadow-2xl ring-1 ring-gold-500/30"
          role="status"
          style={{ x: '-50%' }}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-400 text-maroon-950">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 900)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full bg-maroon-800 text-gold-200 shadow-xl ring-1 ring-gold-500/40 hover:bg-maroon-700"
          aria-label="Back to top"
        >
          ↑
        </motion.a>
      )}
    </AnimatePresence>
  )
}
/* ---------- FLOATING WHATSAPP ---------- */
export function WhatsFloat() {
  return (
    <motion.a
      href="https://wa.me/919586171580?text=Hi%20Alankar!%20I%20need%20help%20choosing%20jewellery"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2 }}
      className="fixed bottom-20 right-5 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#1faa55] text-white shadow-[0_16px_40px_-10px_rgba(31,170,85,0.7)] transition hover:scale-105"
    >
      <span
        className="absolute inset-0 animate-ping rounded-full bg-[#1faa55]/30"
        aria-hidden
      />
      <MessageCircle className="relative h-5 w-5" />
    </motion.a>
  )
}
/* unused re-export guard */
export const __Star = Star
export const __Gift = Gift

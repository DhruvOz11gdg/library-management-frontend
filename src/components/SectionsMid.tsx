import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BadgeIndianRupee, Crown, Droplets, FlaskConical,
  Gem, Gift, Heart, Leaf, Moon, ShieldCheck, ShoppingBag, Sparkles, Sun, Truck,
} from "lucide-react";
import { Eyebrow, Reveal, SectionHeading, Stars } from "./shared";
import { inr, occasions, type Product } from "../data";
const iconMap: Record<string, typeof Sun> = { Sun, Sparkles, Crown, Moon };
/* ---------- SOCIAL PROOF MARQUEE ---------- */
export function SocialProof() {
  const press = ["VOGUE India", "FEMINA", "ShaadiSaga", "WeddingWire", "POPxo", "YourStory", "LBB Mumbai"];
  return (
    <section aria-label="Social proof" className="relative border-y border-maroon-800/10 bg-white/60 py-8 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-maroon-800/60">
            Loved & featured — 2,00,000+ women • As seen in
          </p>
        </Reveal>
        <div className="mask-fade-x mt-5 overflow-hidden" aria-hidden>
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...press, ...press].map((p, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap">
                <span className="font-display text-lg font-semibold tracking-wide text-maroon-900/45 sm:text-xl">{p}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500/60" />
              </span>
            ))}
          </div>
        </div>
        {/* UGC strip */}
        <div className="mask-fade-x mt-6 overflow-hidden" aria-label="Customer photos">
          <div className="flex w-max animate-marquee-slow gap-3 pr-3">
            {[
              "https://images.pexels.com/photos/20507060/pexels-photo-20507060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
              "https://images.pexels.com/photos/36041239/pexels-photo-36041239.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
              "https://images.pexels.com/photos/9333026/pexels-photo-9333026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
              "https://images.pexels.com/photos/7486659/pexels-photo-7486659.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
              "https://images.pexels.com/photos/33963768/pexels-photo-33963768.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
              "https://images.pexels.com/photos/39335345/pexels-photo-39335345.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
              "https://images.pexels.com/photos/33556315/pexels-photo-33556315.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
              "https://images.pexels.com/photos/20627903/pexels-photo-20627903.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            ].flatMap((s) => [s, s]).map((src, i) => (
              <div key={i} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl border border-white shadow-md sm:h-24 sm:w-20">
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">♥ {(12 + i * 3) % 48 + 20}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
/* ---------- OCCASIONS / FEATURES ---------- */
export function Occasions() {
  return (
    <section id="collections" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Shop by occasion"
        title={<>One brand. Every moment of <span className="text-gold-gradient italic">your life.</span></>}
        copy="No more searching 10 sites. Alankar curates imitation jewellery for how Indian women actually live — desk to dandiya to dulhan."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:mt-12">
        {occasions.map((o, i) => {
          const Icon = iconMap[o.icon] ?? Sparkles;
          return (
            <Reveal key={o.title} delay={i * 0.08}>
              <a
                href="#bestsellers"
                className="card-lift img-zoom group relative block overflow-hidden rounded-[28px] bg-maroon-900 shadow-[0_24px_60px_-24px_rgba(74,14,28,0.5)] ring-1 ring-maroon-900/10"
              >
                <img src={o.image} alt={`${o.title} jewellery`} loading="lazy" className="aspect-[3/4] w-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/90 via-maroon-950/25 to-transparent" aria-hidden />
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full glass text-maroon-900">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">{o.price}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300">{o.hindi}</p>
                  <h3 className="font-display mt-1 text-[22px] font-semibold text-white">{o.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">{o.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                    Explore <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-gold-400 group-hover:text-maroon-950"><ArrowUpRight className="h-3.5 w-3.5" /></span>
                  </span>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>
      {/* feature pills */}
      <Reveal delay={0.1} className="mt-8">
        <div className="grid gap-3 rounded-[28px] border border-gold-500/25 bg-gradient-to-r from-white via-[#fff8e8] to-white p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          {[
            { icon: FlaskConical, t: "SkinSafe™ coated", d: "Nickel & lead free" },
            { icon: Droplets, t: "TarnishShield™", d: "Sweat & perfume safe" },
            { icon: Truck, t: "24-hr dispatch", d: "COD + live tracking" },
            { icon: Gift, t: "Gift-ready box", d: "Potli + care card free" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-maroon-800 text-gold-200"><f.icon className="h-5 w-5" /></span>
              <span><span className="block text-[14px] font-bold text-maroon-950">{f.t}</span><span className="block text-[12px] text-[#8a6a73]">{f.d}</span></span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
/* ---------- PRODUCT SHOWCASE ---------- */
const tabs = ["All", "Daily", "Fashion", "Wedding", "Navratri"] as const;
export function Showcase({
  products,
  loading,
  error,
  onRetry,
  onAdd,
  wishlist,
  onWish,
  onQuick,
}: {
  // Block 6: the live catalogue from useProducts() + its fetch state. The grid,
  // tabs and cards are unchanged — this only decides WHAT renders inside them.
  products: Product[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onAdd: (p: Product) => void;
  wishlist: Set<string>;
  onWish: (id: string) => void;
  onQuick: (p: Product) => void;
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const list = useMemo(() => (tab === "All" ? products : products.filter((p) => p.category === tab)), [tab, products]);
  return (
    <section id="bestsellers" className="relative overflow-hidden bg-gradient-to-b from-white via-[#fff6ea] to-cream-50 py-16 sm:py-24">
      <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-blush-200/40 blur-[100px]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Bestsellers • 38k+ reviews"
            title={<>Loved daily. <span className="text-gold-gradient italic">Booked for shaadis.</span></>}
            copy="Real ratings from verified buyers. Tap any piece for styling notes — add to bag in one tap with COD."
          />
          <Reveal delay={0.15}>
            <a href="#pricing" className="group inline-flex items-center gap-2 rounded-full border border-maroon-800/20 bg-white px-5 py-3 text-[14px] font-semibold text-maroon-900 shadow-sm transition hover:shadow-md">
              Build my combo box <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
        {/* tabs */}
        <Reveal className="mt-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="Filter products">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition ${
                  tab === t ? "text-white" : "border border-maroon-800/15 bg-white text-maroon-900 hover:border-maroon-800/30"
                }`}
              >
                {tab === t && (
                  <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-maroon-800 shadow-lg shadow-maroon-800/30" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </Reveal>
        {/* grid — Block 6: loading / error / empty states around the unchanged product cards */}
        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" aria-busy="true" aria-label="Loading the collection">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[22px] border border-maroon-800/10 bg-white shadow-[0_16px_40px_-20px_rgba(74,14,28,0.35)]">
                <div className="aspect-[4/5] w-full animate-pulse bg-cream-200" />
                <div className="space-y-2 p-3 sm:p-4">
                  <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-cream-200" />
                  <div className="h-3 w-3/5 animate-pulse rounded-full bg-cream-200" />
                  <div className="h-9 w-full animate-pulse rounded-full bg-cream-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[26px] border border-maroon-800/15 bg-white p-8 text-center shadow-[0_16px_40px_-24px_rgba(74,14,28,0.35)] sm:p-10">
            <p className="font-display text-xl font-semibold text-maroon-950 sm:text-2xl">We couldn't load the collection</p>
            <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-[#8a6a73]">{error}</p>
            <button
              onClick={onRetry}
              className="mt-5 rounded-full bg-maroon-800 px-7 py-3 text-[13.5px] font-bold text-white shadow-md transition hover:bg-maroon-700 active:scale-[0.98]"
            >
              Try again
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="mt-8 rounded-[26px] border border-maroon-800/15 bg-white p-8 text-center shadow-[0_16px_40px_-24px_rgba(74,14,28,0.35)] sm:p-10">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream-200 text-maroon-800"><Sparkles className="h-6 w-6" /></span>
            <p className="font-display mt-4 text-xl font-semibold text-maroon-950">
              {tab === "All" ? "The collection is being polished" : `No ${tab} pieces right now`}
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-[#8a6a73]">
              {tab === "All"
                ? "New designs are on the way — check back soon, or WhatsApp us for today's fresh stock."
                : "Try another collection — new designs arrive every week."}
            </p>
          </div>
        ) : (
        <motion.div layout className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p) => {
              const off = Math.round((1 - p.price / p.mrp) * 100);
              const wished = wishlist.has(p.id);
              return (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="card-lift group overflow-hidden rounded-[22px] border border-maroon-800/10 bg-white shadow-[0_16px_40px_-20px_rgba(74,14,28,0.35)]"
                >
                  <div className="img-zoom relative cursor-pointer overflow-hidden" onClick={() => onQuick(p)}>
                    <img src={p.image} alt={p.name} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                    <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
                      {p.badge && (
                        <span className="rounded-full bg-maroon-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-200 shadow">
                          {p.badge}
                        </span>
                      )}
                      <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white shadow">-{off}%</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onWish(p.id); }}
                      aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                      aria-pressed={wished}
                      className={`absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full shadow-md backdrop-blur transition active:scale-90 ${
                        wished ? "bg-blush-500 text-white" : "bg-white/85 text-maroon-900 hover:bg-white"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
                    </button>
                    <span className="absolute inset-x-2.5 bottom-2.5 translate-y-2 rounded-full glass px-3 py-2 text-center text-[12px] font-semibold text-maroon-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Quick view →
                    </span>
                  </div>
                  <div className="p-3 sm:p-4">
                    {p.rating != null && (
                      <div className="flex items-center gap-1.5">
                        <Stars className="h-3 w-3" />
                        <span className="text-[11px] font-semibold text-maroon-900">{p.rating}</span>
                        {p.reviews != null && (
                          <span className="text-[11px] text-[#9a7a83]">({p.reviews.toLocaleString("en-IN")})</span>
                        )}
                      </div>
                    )}
                    <h3 className="mt-1.5 line-clamp-2 min-h-[2.6em] text-[13.5px] font-semibold leading-snug text-maroon-950 sm:text-[14.5px]">
                      {p.name}
                    </h3>
                    <p className="mt-0.5 hidden text-[12px] text-[#8a6a73] sm:block">{p.blurb}</p>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-[16px] font-bold text-maroon-900 sm:text-[18px]">{inr(p.price)}</span>
                      <span className="text-[12px] text-[#9a7a83] line-through">{inr(p.mrp)}</span>
                    </div>
                    <button
                      onClick={() => onAdd(p)}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-maroon-800 to-[#a8324f] px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-maroon-800/25 transition hover:shadow-lg active:scale-[0.98]"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
        )}
        {!loading && !error && list.length > 0 && (
          <Reveal className="mt-8 text-center">
            <p className="text-[13px] text-[#8a6a73]">Showing {list.length} {list.length === 1 ? "design" : "designs"} • Free shipping over ₹999 • COD available</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
/* ---------- BENEFITS ---------- */
export function Benefits() {
  const points = [
    { icon: Leaf, title: "Kind to sensitive skin", desc: "Nickel-free, lead-free, dermat-tested coating. No green marks, no itching — even in May humidity." },
    { icon: Droplets, title: "Sweat, perfume & rain resistant", desc: "Triple-plated + e-coat seal. Daily pieces stay golden 12+ months with basic care." },
    { icon: Gem, title: "Looks like real gold & polki", desc: "Brass base, hand-set AD/kundan, real-look finish. 9/10 people can't tell the difference." },
    { icon: BadgeIndianRupee, title: "Honest Indian pricing", desc: "No fake MRPs. Direct-from-karigar rates, COD, and 5% off on prepaid. EMI on bridal." },
  ];
  return (
    <section id="why" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative order-2 lg:order-1">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] shadow-[0_40px_90px_-30px_rgba(74,14,28,0.5)] ring-1 ring-gold-500/30">
              <img
                src="https://images.pexels.com/photos/39058245/pexels-photo-39058245.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
                alt="Alankar necklace styled with marigold flowers"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/60 via-transparent to-transparent" aria-hidden />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl glass-dark p-4 text-cream-50">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gold-300">Alankar promise</p>
                    <p className="font-display text-lg font-semibold">If it tarnishes in 6 months, we re-polish free.</p>
                  </div>
                  <ShieldCheck className="h-10 w-10 shrink-0 text-gold-300" />
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="absolute -right-2 -top-5 sm:right-6">
            <div className="animate-float rounded-2xl border border-gold-500/30 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
              <p className="text-[22px] font-bold text-maroon-900">96%</p>
              <p className="text-[11px] font-semibold text-[#8a6a73]">report zero skin<br />irritation*</p>
            </div>
          </Reveal>
        </div>
        <div className="order-1 lg:order-2">
          <Reveal><Eyebrow>Why 2L+ women switched</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-[1.05] text-maroon-950 sm:text-[2.7rem]">
              Artificial, but make it <span className="text-gold-gradient italic">luxury-grade.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6b4a52]">
              We spent 3 years fixing everything women hate about imitation — itching, blackening, flimsy locks, cheap plastic packaging. The result feels premium from unboxing to 100th wear.
            </p>
          </Reveal>
          <div className="mt-7 space-y-3">
            {points.map((pt, i) => (
              <Reveal key={pt.title} delay={0.06 * i}>
                <div className="group flex gap-4 rounded-3xl border border-maroon-800/10 bg-white p-4 shadow-sm transition hover:border-gold-500/40 hover:shadow-[0_20px_50px_-20px_rgba(212,164,55,0.5)] sm:p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-maroon-800 to-[#a8324f] text-gold-200 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <pt.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-maroon-950">{pt.title}</span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-[#6b4a52]">{pt.desc}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-4 text-[11.5px] text-[#9a7a83]">*Based on 11,240 post-delivery surveys, Jan–Jun 2026.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
/* ---------- CRAFT / STORY (dark) ---------- */
export function Craft() {
  const steps = [
    { n: "01", t: "Designed in Mumbai", d: "Trend team studies runway, street & shaadi looks every month." },
    { n: "02", t: "Hand-finished by karigars", d: "40+ artisan families in Jaipur & Rajkot set every stone." },
    { n: "03", t: "3x quality checked", d: "Plating thickness, lock strength & skin-safety tested." },
    { n: "04", t: "Gift-boxed with love", d: "Potli, care card & polish cloth in every order." },
  ];
  return (
    <section id="craft" className="relative overflow-hidden bg-maroon-950 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-gold-500/15 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-[#a8324f]/25 blur-[100px]" />
        <div className="paisley-bg absolute inset-0 opacity-30" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading
              dark align="left"
              eyebrow="Our craft"
              title={<>From karigar hands to <span className="text-gold-gradient italic">your neckline.</span></>}
              copy="Imitation shouldn't mean cheap. We obsess over weight, finish and fall — so your ₹799 studs feel like ₹7,999."
            />
            <Reveal delay={0.2}>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { n: "40+", l: "Artisan families" },
                  { n: "3x", l: "QC on every piece" },
                  { n: "6-mo", l: "Polish warranty" },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                    <p className="font-display text-2xl font-bold text-gold-300 sm:text-3xl">{s.n}</p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-cream-100/60">{s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#bestsellers" className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3.5 text-[14px] font-bold text-maroon-950 shadow-lg shadow-gold-500/25 transition hover:bg-gold-300">
                  Shop handcrafted <ArrowRight className="h-4 w-4" />
                </a>
                <div className="flex items-center gap-2 text-[13px] text-cream-100/70">
                  <Stars className="h-3 w-3" /> 4.9 from 38k+ reviews
                </div>
              </div>
            </Reveal>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08} className={i % 2 === 1 ? "sm:translate-y-6" : ""}>
                <div className="h-full rounded-[26px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-6 backdrop-blur transition hover:border-gold-400/40">
                  <p className="font-display text-4xl font-bold text-gold-500/40">{s.n}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-cream-50">{s.t}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-cream-100/65">{s.d}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.3} className="sm:col-span-2 sm:translate-y-6">
              <div className="flex flex-col items-center gap-4 overflow-hidden rounded-[26px] bg-gradient-to-r from-gold-400 via-[#f5e0a3] to-gold-400 p-5 sm:flex-row">
                <img
                  src="https://images.pexels.com/photos/39302871/pexels-photo-39302871.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Bride's hands with mehndi and Alankar haathphool"
                  loading="lazy"
                  className="h-20 w-full rounded-2xl object-cover sm:h-16 sm:w-32"
                />
                <p className="text-center text-[14px] font-semibold text-maroon-950 sm:text-left">
                  This wedding season — flat ₹500 off bridal orders over ₹4,999. Code: <span className="rounded bg-maroon-900 px-2 py-0.5 font-mono text-gold-200">DULHAN500</span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Play, RotateCcw, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Stars } from "./shared";
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};
export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative overflow-hidden pt-[132px] sm:pt-[144px]">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff1de] via-cream-50 to-cream-50" />
        <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-blush-200/70 to-gold-200/60 blur-[90px]" />
        <div className="absolute -right-40 top-40 h-[520px] w-[520px] rounded-full bg-gradient-to-bl from-maroon-200/50 to-gold-200/50 blur-[100px]" />
        <div className="absolute left-1/2 top-[420px] h-[600px] w-[900px] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-white/80 to-transparent blur-2xl" />
        <div className="paisley-bg absolute inset-0 opacity-60" />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-20">
        {/* copy */}
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
          <motion.div variants={item}>
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-maroon-800 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-200 shadow-lg shadow-maroon-800/25">
                <Sparkles className="h-3 w-3" /> New • Navratri ’26 Edit
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-maroon-800/15 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-maroon-800 backdrop-blur">
                <span className="flex -space-x-1.5" aria-hidden>
                  {["PS", "KP", "AI"].map((t) => (
                    <span key={t} className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-maroon-700 to-gold-500 text-[7px] font-bold text-white ring-2 ring-white">
                      {t[0]}
                    </span>
                  ))}
                </span>
                2,00,000+ happy customers
              </span>
            </div>
          </motion.div>
          <motion.h1
            variants={item}
            className="font-display mt-5 text-[42px] font-semibold leading-[0.98] tracking-tight text-maroon-950 sm:text-6xl lg:text-[4.6rem]"
          >
            Jewellery that
            <br />
            celebrates{" "}
            <span className="relative inline-block">
              <span className="text-gold-gradient italic">every you.</span>
              <svg viewBox="0 0 220 14" className="absolute -bottom-2 left-0 w-full" aria-hidden>
                <path d="M4 10 C 60 3, 160 3, 216 8" stroke="#D4A437" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
              </svg>
            </span>
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-[#6b4a52] sm:text-[17px]">
            From featherlight office pendants to heirloom-look bridal sets and garba-proof Navratri
            jhumkas — <strong className="font-semibold text-maroon-900">skin-safe, tarnish-resistant</strong>{" "}
            artificial jewellery, made for Indian skin, Indian weather, real life.
          </motion.p>
          <motion.div variants={item} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#bestsellers"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-maroon-800 px-7 py-4 text-[15px] font-semibold text-white shadow-[0_20px_50px_-15px_rgba(74,14,28,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-15px_rgba(74,14,28,0.65)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" aria-hidden />
              Shop Bestsellers
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#collections"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-maroon-800/20 bg-white/70 px-6 py-4 text-[15px] font-semibold text-maroon-900 backdrop-blur transition hover:bg-white"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-maroon-800 text-white">
                <Play className="ml-0.5 h-3 w-3 fill-current" />
              </span>
              Watch the craft film
            </a>
          </motion.div>
          <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-maroon-900/70">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> 6-month polish warranty
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw className="h-4 w-4 text-emerald-600" /> 7-day easy exchange
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-emerald-600" /> COD available
            </span>
          </motion.div>
          {/* rating card */}
          <motion.div
            variants={item}
            className="mt-8 flex max-w-md items-center gap-4 rounded-3xl border border-white/60 bg-white/70 p-4 shadow-[0_20px_50px_-25px_rgba(74,14,28,0.4)] backdrop-blur-xl"
          >
            <div className="flex -space-x-3" aria-hidden>
              {[
                "https://images.pexels.com/photos/20507060/pexels-photo-20507060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                "https://images.pexels.com/photos/7486659/pexels-photo-7486659.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                "https://images.pexels.com/photos/33556315/pexels-photo-33556315.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                "https://images.pexels.com/photos/20627903/pexels-photo-20627903.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
              ].map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
              ))}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-maroon-800 text-[10px] font-bold text-gold-200 ring-2 ring-white">
                2L+
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Stars />
                <span className="text-[13px] font-bold text-maroon-900">4.9/5</span>
              </div>
              <p className="mt-0.5 text-[13px] text-[#6b4a52]">
                <strong className="font-semibold text-maroon-900">38,400+ verified reviews</strong> from women 25–45 across India
              </p>
            </div>
          </motion.div>
        </motion.div>
        {/* visual collage */}
        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* main arch image */}
            <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[36px] border-[6px] border-white shadow-[0_40px_100px_-30px_rgba(74,14,28,0.55)] ring-1 ring-gold-500/30">
              <img
                src="https://images.pexels.com/photos/19891768/pexels-photo-19891768.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
                alt="Indian bride in red lehenga wearing Alankar bridal jewellery"
                className="aspect-[4/5] w-full object-cover"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/55 via-transparent to-transparent" aria-hidden />
              {/* bottom glass strip */}
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl glass px-4 py-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon-700">Bridal bestseller</p>
                  <p className="font-display text-[16px] font-semibold text-maroon-950">Rajkumari Kundan Choker</p>
                </div>
                <a href="#bestsellers" className="rounded-full bg-maroon-800 px-4 py-2 text-[13px] font-semibold text-white shadow hover:bg-maroon-700">
                  ₹2,999
                </a>
              </div>
            </div>
            {/* rotating badge */}
            <div className="absolute -left-6 top-8 hidden sm:block" aria-hidden>
              <div className="relative grid h-28 w-28 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
                  <defs>
                    <path id="circ" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                  </defs>
                  <text className="fill-maroon-800 text-[10.5px] font-bold uppercase tracking-[0.2em]">
                    <textPath href="#circ">skin safe • tarnish free • skin safe •</textPath>
                  </text>
                </svg>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-maroon-900 shadow-lg">
                  <Star className="h-5 w-5 fill-current" />
                </span>
              </div>
            </div>
            {/* floating cards */}
            {!reduce && (
              <>
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-3 top-16 rounded-2xl glass px-3.5 py-3 shadow-xl sm:-right-8"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.pexels.com/photos/37601639/pexels-photo-37601639.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
                      alt="" className="h-11 w-11 rounded-xl object-cover" loading="lazy"
                    />
                    <div>
                      <p className="text-[12px] font-bold text-maroon-950">Garba-proof</p>
                      <p className="text-[11px] text-[#6b4a52]">9 nights • 0 falls</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  className="absolute -left-3 bottom-24 rounded-2xl bg-maroon-900/90 px-4 py-3 text-cream-50 shadow-2xl backdrop-blur sm:-left-10"
                >
                  <p className="flex items-center gap-1.5 text-[12px] font-semibold text-gold-300">
                    <ShieldCheck className="h-3.5 w-3.5" /> TarnishShield™
                  </p>
                  <p className="mt-1 text-[13px] font-medium">Sweat • Perfume • Rain safe</p>
                </motion.div>
              </>
            )}
            {/* small second image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-8 -right-2 hidden w-40 overflow-hidden rounded-3xl border-4 border-white shadow-2xl sm:block lg:-right-6 lg:w-48"
            >
              <img
                src="https://images.pexels.com/photos/11817562/pexels-photo-11817562.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
                alt="Woman wearing Alankar maang tikka and earrings"
                className="aspect-[3/4] w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
          {/* trust strip under visual */}
          <div className="mt-12 grid grid-cols-3 gap-2.5 sm:mt-14">
            {[
              { n: "2L+", l: "Happy customers" },
              { n: "4.9★", l: "38k+ reviews" },
              { n: "500+", l: "New designs / yr" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-maroon-800/10 bg-white/70 px-3 py-3 text-center backdrop-blur">
                <p className="font-display text-xl font-bold text-maroon-900 sm:text-2xl">{s.n}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#8a6a73]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

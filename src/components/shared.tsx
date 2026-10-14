import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon-700 shadow-sm backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-maroon-600 to-gold-500 animate-glow-pulse" aria-hidden />
      {children}
    </span>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : "text-left"} max-w-2xl`}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`font-display mt-4 text-3xl leading-[1.08] font-semibold text-balance sm:text-4xl lg:text-[2.9rem] ${
            dark ? "text-cream-50" : "text-maroon-950"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {copy && (
        <Reveal delay={0.16}>
          <p className={`mt-4 text-[15px] leading-relaxed sm:text-base ${dark ? "text-cream-100/80" : "text-[#6b4a52]"}`}>
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  );
}
export function Stars({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="5 star rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className={`${className} text-gold-500`} aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

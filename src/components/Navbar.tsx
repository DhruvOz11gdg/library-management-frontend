import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react'
const links = [
  { label: 'Collections', href: '#collections' },
  { label: 'Bestsellers', href: '#bestsellers' },
  { label: 'Why Alankar', href: '#why' },
  { label: 'Bridal', href: '#pricing' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
]
export default function Navbar({
  cartCount,
  wishCount,
  onCart,
}: {
  cartCount: number
  wishCount: number
  onCart: () => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* announcement */}
      <div className="bg-gradient-to-r from-maroon-950 via-maroon-800 to-maroon-950 text-cream-100">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[12px] font-medium tracking-wide sm:text-[13px]">
          <Sparkles
            className="h-3.5 w-3.5 shrink-0 text-gold-300"
            aria-hidden
          />
          <p className="truncate">
            <span className="font-semibold text-gold-200">
              Navratri Edit is LIVE
            </span>
            <span className="mx-2 hidden opacity-40 sm:inline">•</span>
            <span className="hidden sm:inline">
              Flat 20% off + Free shipping over ₹999
            </span>
            <span className="sm:hidden"> — 20% off today</span>
          </p>
          <span className="hidden items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] md:inline-flex">
            <Truck className="h-3 w-3" /> COD available
          </span>
        </div>
      </div>
      {/* nav */}
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'glass shadow-[0_12px_40px_-16px_rgba(74,14,28,0.35)]'
            : 'bg-cream-50/80 backdrop-blur-md'
        } border-b border-maroon-800/10`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6"
          aria-label="Primary"
        >
          {/* logo */}
          <a
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label="Alankar home"
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-maroon-800 via-maroon-600 to-[#a8324f] text-gold-200 shadow-lg shadow-maroon-800/30 ring-1 ring-gold-400/40 transition-transform duration-500 group-hover:rotate-[8deg]">
              <svg
                viewBox="0 0 32 32"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden
              >
                <path d="M16 4l2.9 6 6.6.9-4.8 4.6 1.2 6.5L16 18.9 10.1 22l1.2-6.5L6.5 10.9l6.6-.9L16 4z" />
                <circle cx="16" cy="25.2" r="1.6" opacity="0.9" />
              </svg>
              <span
                className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gold-400 blur-[1px]"
                aria-hidden
              />
            </span>
            <span className="leading-none">
              <span className="font-display block text-[22px] font-bold tracking-tight text-maroon-900">
                Alankar
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-700">
                Jewellery • India
              </span>
            </span>
          </a>
          {/* desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[14px] font-medium text-maroon-900/80 transition hover:bg-maroon-800/5 hover:text-maroon-900"
              >
                {l.label}
              </a>
            ))}
          </div>
          {/* actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="tel:+919586171580"
              className="hidden items-center gap-1.5 rounded-full border border-maroon-800/15 bg-white/60 px-3 py-2 text-[13px] font-semibold text-maroon-800 transition hover:bg-white xl:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" /> Stylist Help
            </a>
            <button
              className="hidden h-10 w-10 place-items-center rounded-full text-maroon-900/70 transition hover:bg-maroon-800/5 sm:grid"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              className="relative grid h-10 w-10 place-items-center rounded-full text-maroon-900/80 transition hover:bg-maroon-800/5"
              aria-label={`Wishlist, ${wishCount} items`}
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-blush-500 px-1 text-[10px] font-bold text-white">
                  {wishCount}
                </span>
              )}
            </button>
            <button
              onClick={onCart}
              className="relative grid h-10 w-10 place-items-center rounded-full text-maroon-900 transition hover:bg-maroon-800/5"
              aria-label={`Open bag, ${cartCount} items`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-maroon-800 px-1 text-[10px] font-bold text-gold-200"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            <a
              href="#bestsellers"
              className="group relative hidden overflow-hidden rounded-full bg-maroon-800 px-5 py-2.5 text-[14px] font-semibold text-cream-50 shadow-lg shadow-maroon-800/30 transition hover:shadow-xl hover:shadow-maroon-800/40 sm:inline-flex"
            >
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                aria-hidden
              />
              Shop Now
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-maroon-800/15 text-maroon-900 lg:hidden"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        {/* mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-maroon-800/10 lg:hidden"
            >
              <div className="space-y-1 px-4 py-4">
                {links.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium text-maroon-900 hover:bg-maroon-800/5"
                  >
                    {l.label}
                    <span aria-hidden className="text-gold-600">
                      →
                    </span>
                  </motion.a>
                ))}
                <a
                  href="#bestsellers"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center justify-center rounded-2xl bg-maroon-800 px-4 py-3.5 text-[15px] font-semibold text-white"
                >
                  Shop Bestsellers — 20% Off
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

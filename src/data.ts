/**
 * src/data.ts
 * Marketing copy + shared types ONLY.
 *
 * Block 6 removed the hardcoded `products` array: the storefront now fetches
 * real products from alankar-backend via `useProducts()` (src/hooks). The
 * `Product` type stays here — extended with the fields the API provides
 * (`sku` for the WhatsApp checkout message, `slug`, `categoryName`, stock and
 * flag fields). `rating`/`reviews` became optional: the backend has no review
 * system yet, and the components hide that row rather than showing invented
 * numbers. `testimonials`, `faqs`, `occasions` and `inr()` are marketing copy /
 * helpers, not product data, so they stay exactly as they were.
 */
export type ProductCategory = "Daily" | "Fashion" | "Wedding" | "Navratri";
export type Product = {
  id: string;
  /** Stock-keeping unit from the backend, e.g. "NK-DA-001" — printed in the WhatsApp order message */
  sku: string;
  name: string;
  /** Showcase tab, derived from occasionTags/category by products.service.mapApiProduct */
  category: ProductCategory;
  /** Real database category name, e.g. "Necklace" — shown in QuickView */
  categoryName: string;
  slug: string;
  price: number;
  mrp: number;
  /** Hidden by the UI while the backend has no review system */
  rating?: number;
  reviews?: number;
  image: string;
  thumbUrl?: string;
  /** Derived: "Bestseller" | "Featured" | "New" (see products.service.deriveBadge) */
  badge?: string;
  blurb: string;
  colors: string[];
  occasionTags?: string[];
  inStock?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
};
export const testimonials = [
  {
    name: "Priya Sharma",
    age: "32 · Mumbai",
    tag: "Wedding",
    quote:
      "My bridal choker got more compliments than my cousin's real polki. No one believed it was under ₹3,000. Zero itching even after 12 hours!",
    stars: 5,
    product: "Rajkumari Kundan Choker",
    gradient: "from-rose-400 to-orange-300",
  },
  {
    name: "Kinjal Patel",
    age: "28 · Ahmedabad",
    tag: "Navratri",
    quote:
      "Danced all 9 nights in Garba Glow jhumkas — no green marks, no pain, no fall-offs. My entire garba group ordered the same set.",
    stars: 5,
    product: "Garba Glow Jhumkas",
    gradient: "from-fuchsia-500 to-amber-300",
  },
  {
    name: "Ananya Iyer",
    age: "36 · Bengaluru",
    tag: "Daily Wear",
    quote:
      "As a doctor I need something light, sweat-proof and classy. The Meher pendant hasn't tarnished in 5 months of daily use. Truly premium.",
    stars: 5,
    product: "Meher Minimal Pendant",
    gradient: "from-emerald-400 to-teal-300",
  },
  {
    name: "Sneha Deshmukh",
    age: "41 · Pune",
    tag: "Fashion",
    quote:
      "Sensitive skin girlie here — Alankar is the ONLY artificial brand that doesn't give me rashes. The anti-allergic coating actually works.",
    stars: 5,
    product: "Noor AD Studs",
    gradient: "from-violet-500 to-pink-300",
  },
  {
    name: "Ritu Malhotra",
    age: "29 · Delhi",
    tag: "Wedding",
    quote:
      "Ordered the Royal Bridal trousseau for my sister's wedding. Packaging felt like Tanishq, exchange was effortless. Worth every rupee.",
    stars: 5,
    product: "Royal Bridal Trousseau",
    gradient: "from-amber-500 to-red-400",
  },
  {
    name: "Disha Shah",
    age: "25 · Surat",
    tag: "Gifting",
    quote:
      "Gifted the Festive Edit box to my mom — she cried. The handwritten note, potli, care card... such thoughtful details for this price.",
    stars: 5,
    product: "Festive Edit Box",
    gradient: "from-sky-400 to-indigo-300",
  },
];
export const faqs = [
  {
    q: "Will Alankar jewellery cause skin allergies or turn black?",
    a: "No. Every piece is nickel-free, lead-free and coated with our SkinSafe™ + TarnishShield™ layers. It's sweat, perfume and water-spray resistant. 96% of customers with sensitive skin report zero irritation. If you ever react, our 7-day easy exchange has you covered.",
  },
  {
    q: "How is this different from cheap artificial jewellery on marketplaces?",
    a: "Marketplace jewellery often uses raw alloy that blackens in weeks. Alankar uses brass-base with 18K gold / rhodium micro-plating, hand-set stones, and 3x QC checks. We offer 6-month polish warranty, premium gift packaging and real human support on WhatsApp — not just a packet in plastic.",
  },
  {
    q: "Can I wear daily-wear pieces to office, gym or in rain?",
    a: "Our Daily edit is made for real life — light sweat, light rain and daily perfume are fine. We recommend removing before swimming, heavy workouts or applying attar directly. Wipe with the free soft pouch cloth and it stays golden for 12+ months.",
  },
  {
    q: "What if I need it urgently for a wedding or Navratri?",
    a: "We dispatch in 24 hours from Mumbai + Ahmedabad hubs. Metro delivery in 2-3 days, rest of India in 3-5 days. At checkout you can add Express (1-2 day) and gift wrap. For brides, we offer free video-call styling to match your outfit.",
  },
  {
    q: "What is your return / exchange policy?",
    a: "7-day no-questions-asked size/color exchange, and damage replacement with unboxing video. Bridal trousseaus get 15-day exchange window + dedicated stylist. COD available, UPI/cards/netbanking secured by Razorpay.",
  },
  {
    q: "Do you have combos for Navratri 9 nights or bridal trousseau?",
    a: "Yes! Our Festive Edit (₹2,999) curates 5 mix-match pieces for 9 nights under one price, and Royal Bridal (₹9,999) packs 11 pieces head-to-toe. Buying the box saves 35-40% vs. singles — and every box ships in a keepsake potli + vanity case.",
  },
  {
    q: "Is Cash on Delivery (COD) available?",
    a: "Yes, COD is available across 27,000+ pincodes with only ₹99 advance to confirm. Prepaid orders get extra 5% off + free shipping over ₹999. All orders include live tracking on WhatsApp.",
  },
];
export const occasions = [
  {
    title: "Daily Wear",
    hindi: "Roz ka saath",
    desc: "Light, skin-safe pendants & studs for office, college & errands.",
    price: "From ₹499",
    image:
      "https://images.pexels.com/photos/4938194/pexels-photo-4938194.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    icon: "Sun",
  },
  {
    title: "Fashion & Party",
    hindi: "Shine on",
    desc: "AD, pearl & oxidised statements for brunches, dates & nights out.",
    price: "From ₹699",
    image:
      "https://images.pexels.com/photos/15119009/pexels-photo-15119009.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    icon: "Sparkles",
  },
  {
    title: "Wedding & Bridal",
    hindi: "Dulhan wala glow",
    desc: "Kundan, polki-look & temple sets that photograph like real gold.",
    price: "From ₹1,999",
    image:
      "https://images.pexels.com/photos/33023960/pexels-photo-33023960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    icon: "Crown",
  },
  {
    title: "Navratri & Festive",
    hindi: "Garba ready",
    desc: "Mirror, bandhani & oxidised jhumkas built for 9 nights of dance.",
    price: "From ₹499",
    image:
      "https://images.pexels.com/photos/29492764/pexels-photo-29492764.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    icon: "Moon",
  },
];
export function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

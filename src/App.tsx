import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { Benefits, Craft, Occasions, Showcase, SocialProof } from "./components/SectionsMid";
import {
  BackToTop, CartDrawer, CTA, FAQ, Footer, Pricing, QuickView, Testimonials, Toast, WhatsFloat,
  type CartItem,
} from "./components/SectionsBottom";
import { useProducts } from "./hooks/useProducts";
import type { Product } from "./data";
export default function App() {
  // Block 6: live catalogue from alankar-backend — replaces the static data.ts import.
  const { products, loading, error, reload } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  // lock scroll when drawer/modal open
  useEffect(() => {
    document.body.style.overflow = cartOpen || quick ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, quick]);
  const addProduct = useCallback((p: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      // Block 9: sku travels with the cart item into the WhatsApp order message.
      return [...prev, { id: p.id, sku: p.sku, name: p.name, price: p.price, image: p.image, qty: 1 }];
    });
    notify(`${p.name.slice(0, 34)}${p.name.length > 34 ? "…" : ""} added to bag ✨`);
  }, [notify]);
  const addBox = useCallback((name: string, price: number) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === name);
      if (found) return prev.map((i) => (i.id === name ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: name, name: `${name} Box`, price, image: "https://images.pexels.com/photos/29038003/pexels-photo-29038003.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", qty: 1 }];
    });
    notify(`${name} added to bag 🎁`);
    setCartOpen(true);
  }, [notify]);
  const toggleWish = useCallback((id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); notify("Removed from wishlist"); }
      else { next.add(id); notify("Saved to wishlist ♥"); }
      return next;
    });
  }, [notify]);
  const changeQty = useCallback((id: string, d: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))
    );
  }, []);
  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="min-h-screen bg-cream-50 font-sans text-[#2a1418]">
      <a
        href="#bestsellers"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-maroon-800 focus:px-5 focus:py-2.5 focus:text-white"
      >
        Skip to shopping
      </a>
      <Navbar cartCount={cartCount} wishCount={wishlist.size} onCart={() => setCartOpen(true)} />
      <main>
        <Hero />
        <SocialProof />
        <Occasions />
        <Showcase
          products={products}
          loading={loading}
          error={error}
          onRetry={reload}
          onAdd={addProduct}
          wishlist={wishlist}
          onWish={toggleWish}
          onQuick={setQuick}
        />
        <Benefits />
        <Craft />
        <Testimonials />
        <Pricing onAddBox={addBox} />
        <FAQ />
        <CTA onNotify={notify} />
      </main>
      <Footer onNotify={notify} />
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={removeItem} />
      <QuickView product={quick} products={products} wished={quick ? wishlist.has(quick.id) : false} onClose={() => setQuick(null)} onAdd={addProduct} onWish={toggleWish} />
      <Toast msg={toast} />
      <WhatsFloat />
      <BackToTop />
    </div>
  );
}

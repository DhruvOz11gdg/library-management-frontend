/**
 * src/admin/AdminDashboard.tsx
 * The owner's control room (Blocks 7 + 8): live stats, the products table,
 * the create/edit form (with instant image uploads) and the category manager —
 * one page, no routing gymnastics, fast on a phone at the shop.
 *
 * Views: "products" (table) → "new"/"edit" (ProductForm) → "categories".
 * Stats refresh after every mutation so the counters never lie.
 */
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle, CheckCircle2, Eye, EyeOff, Layers, LogOut, Package,
  Sparkles, Star, Store, Tags,
} from "lucide-react";
import { getStats, listCategoriesAdmin } from "./services/admin.service";
import { apiErrorMessage } from "../services/api";
import type { ApiAdmin, ApiCategory, ApiProduct, ApiStats } from "../services/types";
import { ProductTable } from "./components/ProductTable";
import { ProductForm } from "./components/ProductForm";
import { CategoryManager } from "./components/CategoryManager";

type View = "products" | "new" | "edit" | "categories";

export function AdminDashboard({
  admin,
  onSignOut,
}: {
  admin: ApiAdmin;
  onSignOut: () => Promise<void>;
}) {
  const [view, setView] = useState<View>("products");
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [statsKey, setStatsKey] = useState(0);

  const refreshStats = useCallback(() => setStatsKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then((s) => {
        if (!cancelled) {
          setStats(s);
          setStatsError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setStatsError(apiErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [statsKey]);

  // ProductForm's category select shows ACTIVE categories (the backend refuses
  // to save a product into a hidden one, so offering them would be a dead end).
  useEffect(() => {
    let cancelled = false;
    listCategoriesAdmin()
      .then((list) => {
        if (!cancelled) setCategories(list.filter((c) => c.isActive));
      })
      .catch(() => {
        /* the form shows its own error; an empty select explains itself */
      });
    return () => {
      cancelled = true;
    };
  }, [statsKey]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(id);
  }, [toast]);

  function notify(msg: string) {
    setToast(msg);
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await onSignOut();
    } finally {
      setSigningOut(false);
    }
  }

  const statCards = stats
    ? [
        { icon: Package, label: "Total products", value: stats.total, tone: "text-maroon-900" },
        { icon: Eye, label: "Live on storefront", value: stats.active, tone: "text-emerald-700" },
        { icon: EyeOff, label: "Hidden", value: stats.inactive, tone: "text-[#8a6a73]" },
        { icon: AlertTriangle, label: "Low stock", value: stats.lowStock, tone: "text-amber-700" },
        { icon: Star, label: "Bestsellers", value: stats.bestsellers, tone: "text-maroon-900" },
        { icon: Sparkles, label: "Featured", value: stats.featured, tone: "text-gold-700" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-cream-50 font-sans text-[#2a1418]">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-maroon-800/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-maroon-950 shadow">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <div className="mr-auto">
            <p className="font-display text-lg font-bold leading-none text-maroon-950">Alankar Admin</p>
            <p className="mt-0.5 text-[11.5px] text-[#8a6a73]">Signed in as {admin.email}</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-maroon-800/20 bg-white px-4 py-2 text-[12.5px] font-bold text-maroon-900 transition hover:border-maroon-800/45"
          >
            <Store className="h-3.5 w-3.5" /> View store
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-1.5 rounded-full bg-maroon-800 px-4 py-2 text-[12.5px] font-bold text-white transition hover:bg-maroon-700 disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" /> {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* stats */}
        {statsError ? (
          <p className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700" role="alert">
            {statsError}
          </p>
        ) : (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {statCards.map((card) => (
              <div key={card.label} className="rounded-[20px] border border-maroon-800/10 bg-white p-4 shadow-sm">
                <card.icon className={`h-4 w-4 ${card.tone}`} />
                <p className={`font-display mt-1.5 text-2xl font-bold ${card.tone}`}>{stats ? card.value : "…"}</p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8a6a73]">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* out-of-stock nudge — actionable, not decorative */}
        {stats && stats.outOfStock > 0 && view === "products" && (
          <p className="mb-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {stats.outOfStock} product{stats.outOfStock === 1 ? " is" : "s are"} out of stock — restock or hide{" "}
            {stats.outOfStock === 1 ? "it" : "them"} so customers don't order unavailable pieces.
          </p>
        )}

        {/* view switcher (hidden while the form is open — focus on one thing) */}
        {(view === "products" || view === "categories") && (
          <div className="mb-5 flex gap-2" role="tablist" aria-label="Admin sections">
            <button
              role="tab"
              aria-selected={view === "products"}
              onClick={() => setView("products")}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-bold transition ${
                view === "products"
                  ? "bg-maroon-800 text-gold-200 shadow-md"
                  : "border border-maroon-800/15 bg-white text-maroon-900 hover:border-maroon-800/35"
              }`}
            >
              <Tags className="h-4 w-4" /> Products
            </button>
            <button
              role="tab"
              aria-selected={view === "categories"}
              onClick={() => setView("categories")}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-bold transition ${
                view === "categories"
                  ? "bg-maroon-800 text-gold-200 shadow-md"
                  : "border border-maroon-800/15 bg-white text-maroon-900 hover:border-maroon-800/35"
              }`}
            >
              <Layers className="h-4 w-4" /> Categories
            </button>
          </div>
        )}

        {/* views */}
        {view === "products" && (
          <ProductTable
            onNew={() => {
              setEditing(null);
              setView("new");
            }}
            onEdit={(p) => {
              setEditing(p);
              setView("edit");
            }}
            onChanged={refreshStats}
          />
        )}
        {view === "categories" && <CategoryManager onChanged={refreshStats} />}
        {(view === "new" || view === "edit") && (
          <ProductForm
            key={view === "edit" && editing ? editing.id : "new"}
            editing={view === "edit" ? editing : null}
            categories={categories}
            onCancel={() => {
              setEditing(null);
              setView("products");
            }}
            onSaved={(product, wasEdit) => {
              setEditing(null);
              setView("products");
              refreshStats();
              notify(
                wasEdit
                  ? `Saved "${product.name}" (${product.sku}) ✓`
                  : `"${product.name}" is live with SKU ${product.sku} 🎉`
              );
            }}
          />
        )}
      </main>

      {/* toast */}
      {toast && (
        <div
          className="fixed bottom-5 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-maroon-950 px-4 py-3.5 text-[13.5px] font-medium text-cream-50 shadow-2xl ring-1 ring-gold-500/30"
          role="status"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-400 text-maroon-950">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

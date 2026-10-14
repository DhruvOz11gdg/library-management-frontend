/**
 * src/admin/components/ProductTable.tsx
 * The owner's stock list (Block 8): every product INCLUDING hidden ones,
 * with edit / hide / unhide and the low-stock highlight the spec asks for
 * (stockQty <= lowStockAlert → amber; 0 → red "Out of stock").
 *
 * Reads GET /v1/admin/products (D30 endpoint — the public list hides exactly
 * what this table must show). "Hide" is the soft delete: DELETE /v1/products/:id
 * sets isActive:false; nothing is ever destroyed and "Unhide" brings it back.
 */
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, EyeOff, Eye, Loader2, PackageSearch, Pencil, Plus, Search } from "lucide-react";
import {
  deleteProduct,
  listProductsAdmin,
  updateProduct,
  type AdminProductFilters,
} from "../services/admin.service";
import { apiErrorMessage } from "../../services/api";
import type { ApiListMeta, ApiProduct } from "../../services/types";
import { inr } from "../../data";

const PAGE_SIZE = 20;

type StatusFilter = "all" | "active" | "inactive";

export function ProductTable({
  onEdit,
  onNew,
  onChanged,
}: {
  onEdit: (product: ApiProduct) => void;
  onNew: () => void;
  /** tell the dashboard to refresh its stats after any mutation */
  onChanged: () => void;
}) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState<ApiListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const filters: AdminProductFilters = { status, page, limit: PAGE_SIZE, sort: "newest" };
    if (lowStockOnly) filters.lowStock = true;
    if (search.trim()) filters.search = search.trim();
    listProductsAdmin(filters)
      .then((res) => {
        if (cancelled) return;
        setProducts(res.products);
        setMeta(res.meta);
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, lowStockOnly, search, page, reloadKey]);

  // Any filter change starts over at page 1.
  useEffect(() => setPage(1), [status, lowStockOnly, search]);

  async function hideProduct(p: ApiProduct) {
    const ok = window.confirm(
      `Hide "${p.name}" (${p.sku}) from the storefront?\n\nNothing is deleted — you can unhide it here any time.`
    );
    if (!ok) return;
    setBusyId(p.id);
    try {
      await deleteProduct(p.id);
      reload();
      onChanged();
    } catch (err) {
      window.alert(apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function unhideProduct(p: ApiProduct) {
    setBusyId(p.id);
    try {
      await updateProduct(p.id, { isActive: true });
      reload();
      onChanged();
    } catch (err) {
      window.alert(apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex overflow-hidden rounded-full border border-maroon-800/15 bg-white" role="tablist" aria-label="Filter by status">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={status === s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 text-[12.5px] font-bold capitalize transition ${
                status === s ? "bg-maroon-800 text-gold-200" : "text-maroon-900 hover:bg-cream-100"
              }`}
            >
              {s === "all" ? "All" : s === "active" ? "Live" : "Hidden"}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-maroon-800/15 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-maroon-900">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="h-3.5 w-3.5 accent-[#4a0e1c]"
          />
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Low stock only
        </label>
        <form
          className="flex min-w-[200px] flex-1 items-center gap-1.5 rounded-full border border-maroon-800/15 bg-white px-3.5 py-1.5 focus-within:border-gold-500 sm:max-w-xs"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput);
          }}
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-[#8a6a73]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or SKU…"
            aria-label="Search products"
            className="w-full bg-transparent py-0.5 text-[13px] text-maroon-950 placeholder:text-[#b49aa1] focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearch("");
              }}
              className="shrink-0 text-[11px] font-bold text-[#8a6a73] hover:text-maroon-800"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </form>
        <button
          onClick={onNew}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-maroon-800 px-5 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:bg-maroon-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {/* table */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-[22px] border border-maroon-800/10 bg-white py-14 text-[13.5px] font-medium text-[#8a6a73]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading products…
        </div>
      ) : error ? (
        <div className="rounded-[22px] border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-[13.5px] font-semibold text-red-700">{error}</p>
          <button onClick={reload} className="mt-3 rounded-full bg-red-600 px-5 py-2 text-[12.5px] font-bold text-white hover:bg-red-500">
            Try again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-[22px] border border-maroon-800/10 bg-white p-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cream-200 text-maroon-800">
            <PackageSearch className="h-5 w-5" />
          </span>
          <p className="font-display mt-3 text-lg font-semibold text-maroon-950">No products here (yet)</p>
          <p className="mt-1 text-[13px] text-[#8a6a73]">
            {search || lowStockOnly || status !== "all"
              ? "Nothing matches these filters — try widening them."
              : "Add your first piece and it appears on the storefront instantly."}
          </p>
          <button
            onClick={onNew}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-maroon-800 px-6 py-2.5 text-[13px] font-bold text-white hover:bg-maroon-700"
          >
            <Plus className="h-4 w-4" /> Add product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[22px] border border-maroon-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-maroon-800/10 bg-cream-100/70 text-[11px] font-bold uppercase tracking-wider text-[#8a6a73]">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const out = p.stockQty === 0;
                const low = !out && p.isLowStock;
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-maroon-800/8 text-[13px] last:border-0 ${
                      !p.isActive
                        ? "bg-cream-100/40 opacity-70"
                        : out
                          ? "bg-red-50/60"
                          : low
                            ? "bg-amber-50/70"
                            : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.thumbUrl || p.image ? (
                          <img src={p.thumbUrl || p.image} alt="" className="h-12 w-10 shrink-0 rounded-lg object-cover ring-1 ring-maroon-800/10" />
                        ) : (
                          <span className="grid h-12 w-10 shrink-0 place-items-center rounded-lg bg-cream-200 text-[10px] font-bold text-[#8a6a73]">No photo</span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-bold text-maroon-950" title={p.name}>{p.name}</p>
                          <p className="font-mono text-[11px] text-[#8a6a73]">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-[#6b4a52]">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-maroon-900">{inr(p.price)}</p>
                      <p className="text-[11px] text-[#9a7a83]">
                        MRP <span className="line-through">{inr(p.mrp)}</span>
                        {p.margin != null && <span className="ml-1 font-semibold text-gold-700">· {p.margin}% margin</span>}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {out ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
                          <AlertTriangle className="h-3 w-3" /> Out of stock
                        </span>
                      ) : low ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                          <AlertTriangle className="h-3 w-3" /> Low — {p.stockQty} left
                        </span>
                      ) : (
                        <span className="font-semibold text-maroon-900">{p.stockQty}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.isBestseller && <span className="rounded-full bg-maroon-800 px-2 py-0.5 text-[10px] font-bold text-gold-200">Bestseller</span>}
                        {p.isFeatured && <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-maroon-950">Featured</span>}
                        {!p.isBestseller && !p.isFeatured && <span className="text-[11px] text-[#b49aa1]">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          <Eye className="h-3 w-3" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2.5 py-1 text-[11px] font-bold text-[#8a6a73]">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(p)}
                          className="inline-flex items-center gap-1 rounded-full border border-maroon-800/20 bg-white px-3 py-1.5 text-[12px] font-bold text-maroon-900 transition hover:border-maroon-800/45"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        {p.isActive ? (
                          <button
                            onClick={() => hideProduct(p)}
                            disabled={busyId === p.id}
                            className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1.5 text-[12px] font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {busyId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <EyeOff className="h-3 w-3" />} Hide
                          </button>
                        ) : (
                          <button
                            onClick={() => unhideProduct(p)}
                            disabled={busyId === p.id}
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[12px] font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                          >
                            {busyId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />} Unhide
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* pagination */}
      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between text-[12.5px] text-[#6b4a52]">
          <p>
            Page {meta.page} of {meta.totalPages} • {meta.total} product{meta.total === 1 ? "" : "s"}
            {meta.searchMode === "partial" && search && <span className="ml-1 text-[#8a6a73]">(partial match)</span>}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((n) => Math.max(1, n - 1))}
              disabled={page <= 1 || loading}
              className="rounded-full border border-maroon-800/20 bg-white px-4 py-1.5 font-bold text-maroon-900 transition hover:border-maroon-800/45 disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((n) => n + 1)}
              disabled={!meta.hasMore || loading}
              className="rounded-full border border-maroon-800/20 bg-white px-4 py-1.5 font-bold text-maroon-900 transition hover:border-maroon-800/45 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

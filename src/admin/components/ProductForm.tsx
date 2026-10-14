/**
 * src/admin/components/ProductForm.tsx
 * Create + edit one product (Block 7).
 *
 * Spec details honoured:
 *  - SKU field is PRE-FILLED with the server's suggestion (GET /admin/sku-suggestion,
 *    refreshed when the category or first occasion tag changes) and remains fully
 *    editable; clearing it lets the backend auto-generate on save.
 *  - every field maps 1:1 onto the backend Product schema (price/mrp cross-check
 *    mirrored client-side so the owner gets the error before a round trip).
 *  - images are handled by ImageUploader (uploaded the moment they are picked).
 */
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, Plus, Save, Sparkles, X } from "lucide-react";
import {
  createProduct,
  getSkuSuggestion,
  updateProduct,
  type ProductPayload,
} from "../services/admin.service";
import { apiErrorMessage } from "../../services/api";
import type { ApiCategory, ApiProduct } from "../../services/types";
import { ImageUploader, type FormImage } from "./ImageUploader";
import { inr } from "../../data";

/** Quick-add occasion tags — the storefront's tabs are derived from these. */
const TAG_PRESETS = ["daily", "office", "fashion", "party", "wedding", "bridal", "navratri", "garba", "festive"];
const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

interface FormState {
  name: string;
  categorySlug: string;
  sku: string;
  skuTouched: boolean; // once the owner types, stop overwriting with suggestions
  occasionTags: string[];
  tagDraft: string;
  description: string;
  price: string;
  mrp: string;
  costPrice: string;
  stockQty: string;
  lowStockAlert: string;
  colors: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  images: FormImage[];
}

function emptyForm(): FormState {
  return {
    name: "",
    categorySlug: "",
    sku: "",
    skuTouched: false,
    occasionTags: [],
    tagDraft: "",
    description: "",
    price: "",
    mrp: "",
    costPrice: "",
    stockQty: "10",
    lowStockAlert: "3",
    colors: [],
    isFeatured: false,
    isBestseller: false,
    isActive: true,
    images: [],
  };
}

function formFromProduct(p: ApiProduct): FormState {
  return {
    name: p.name,
    categorySlug: p.category?.slug || "",
    sku: p.sku,
    skuTouched: true, // an existing SKU is never silently re-suggested
    occasionTags: p.occasionTags || [],
    tagDraft: "",
    description: p.description || "",
    price: String(p.price),
    mrp: String(p.mrp),
    costPrice: p.costPrice != null ? String(p.costPrice) : "",
    stockQty: String(p.stockQty),
    lowStockAlert: p.lowStockAlert != null ? String(p.lowStockAlert) : "3",
    colors: p.colors || [],
    isFeatured: p.isFeatured,
    isBestseller: p.isBestseller,
    isActive: p.isActive,
    // The admin shape may include deleteUrl — it is dropped here on purpose:
    // the panel never holds or resends it (backend re-attaches it on save).
    images: (p.images || []).map((img) => ({ url: img.url, thumbUrl: img.thumbUrl, isPrimary: img.isPrimary })),
  };
}

const inputClass =
  "w-full rounded-2xl border border-maroon-800/15 bg-white px-4 py-2.5 text-[14px] text-maroon-950 placeholder:text-[#b49aa1] focus:border-gold-500 focus:outline-none";
const labelClass = "mb-1.5 block text-[12.5px] font-bold text-maroon-950";

export function ProductForm({
  editing,
  categories,
  onSaved,
  onCancel,
}: {
  /** null = create mode; a product (admin shape) = edit mode */
  editing: ApiProduct | null;
  /** active categories for the select */
  categories: ApiCategory[];
  onSaved: (product: ApiProduct, wasEdit: boolean) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => (editing ? formFromProduct(editing) : emptyForm()));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skuHint, setSkuHint] = useState<string | null>(null);
  const [colorDraft, setColorDraft] = useState("#D4A437");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* ---- live SKU suggestion while creating (never overwrites typed input) ---- */
  const firstTag = form.occasionTags[0] || "";
  useEffect(() => {
    if (editing || form.skuTouched || !form.categorySlug) {
      setSkuHint(null);
      return;
    }
    let cancelled = false;
    getSkuSuggestion(form.categorySlug, firstTag)
      .then((res) => {
        if (cancelled) return;
        setForm((prev) => (prev.skuTouched ? prev : { ...prev, sku: res.suggestion }));
        setSkuHint(`Suggested from ${res.categoryName}${res.styleHint ? ` + "${res.styleHint}"` : ""} — editable.`);
      })
      .catch(() => {
        if (!cancelled) setSkuHint(null);
      });
    return () => {
      cancelled = true;
    };
  }, [editing, form.categorySlug, form.skuTouched, firstTag]);

  const discount = useMemo(() => {
    const price = Number(form.price);
    const mrp = Number(form.mrp);
    if (!Number.isFinite(price) || !Number.isFinite(mrp) || mrp <= 0 || mrp <= price) return null;
    return Math.round(((mrp - price) / mrp) * 100);
  }, [form.price, form.mrp]);

  function addTag(tag: string) {
    const clean = tag.trim().toLowerCase();
    if (!clean) return;
    if (!form.occasionTags.includes(clean)) {
      update("occasionTags", [...form.occasionTags, clean]);
    }
    update("tagDraft", "");
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.categorySlug) return "Pick a category — the SKU and storefront shelf depend on it.";
    const price = Number(form.price);
    const mrp = Number(form.mrp);
    if (form.price === "" || !Number.isFinite(price) || price < 0) return "Selling price must be a number (₹0 or more).";
    if (form.mrp === "" || !Number.isFinite(mrp) || mrp < 0) return "MRP must be a number (₹0 or more).";
    if (mrp < price) return `MRP (${inr(mrp)}) cannot be less than the selling price (${inr(price)}) — the strikethrough price must be the higher one.`;
    if (form.stockQty !== "" && (!Number.isInteger(Number(form.stockQty)) || Number(form.stockQty) < 0)) {
      return "Stock must be a whole number (0 or more).";
    }
    const badColor = form.colors.find((c) => !HEX_COLOR.test(c));
    if (badColor) return `Colour "${badColor}" is not a hex code like #A62B4D.`;
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    const payload: ProductPayload = {
      name: form.name.trim(),
      category: form.categorySlug,
      sku: form.sku.trim() || undefined, // blank → backend auto-generates
      occasionTags: form.occasionTags,
      description: form.description.trim(),
      price: Number(form.price),
      mrp: Number(form.mrp),
      costPrice: form.costPrice === "" ? undefined : Number(form.costPrice),
      stockQty: form.stockQty === "" ? 0 : Number(form.stockQty),
      lowStockAlert: form.lowStockAlert === "" ? undefined : Number(form.lowStockAlert),
      colors: form.colors,
      images: form.images.map(({ url, thumbUrl, isPrimary }) => ({ url, thumbUrl, isPrimary })),
      isFeatured: form.isFeatured,
      isBestseller: form.isBestseller,
      isActive: form.isActive,
      styleHint: firstTag || undefined,
    };
    setBusy(true);
    try {
      const saved = editing ? await updateProduct(editing.id, payload) : await createProduct(payload);
      onSaved(saved, Boolean(editing));
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  // True while ImageUploader still has files in flight — saving then would
  // drop the unfinished photos from the product.
  const [uploadsBusy, setUploadsBusy] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-maroon-950">
            {editing ? `Edit — ${editing.name}` : "Add a new product"}
          </h2>
          <p className="mt-0.5 text-[13px] text-[#8a6a73]">
            {editing
              ? `SKU ${editing.sku} • changes appear on the storefront immediately after saving`
              : "Photos upload as you pick them — fill the rest while they fly."}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-full border border-maroon-800/20 bg-white px-4 py-2 text-[13px] font-semibold text-maroon-900 transition hover:border-maroon-800/40"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      </div>

      {/* photos first — the spec's #1 priority is getting images in fast */}
      <section className="rounded-[24px] border border-maroon-800/10 bg-white p-5 shadow-sm">
        <ImageUploader
          images={form.images}
          onChange={(next) => update("images", next)}
          nameHint={form.name.trim() || undefined}
          disabled={busy}
          onBusyChange={setUploadsBusy}
        />
        {uploadsBusy && (
          <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-semibold text-maroon-800">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Photos are still uploading — saving unlocks when they finish.
          </p>
        )}
      </section>

      <section className="grid gap-5 rounded-[24px] border border-maroon-800/10 bg-white p-5 shadow-sm lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label htmlFor="pf-name" className={labelClass}>Product name *</label>
          <input
            id="pf-name"
            className={inputClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Peacock Oxidised Choker"
            maxLength={140}
            required
          />
        </div>
        <div>
          <label htmlFor="pf-category" className={labelClass}>Category *</label>
          <select
            id="pf-category"
            className={inputClass}
            value={form.categorySlug}
            onChange={(e) => update("categorySlug", e.target.value)}
            required
          >
            <option value="">Choose a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
                {c.isSubcategory && c.parentName ? ` (under ${c.parentName})` : ""}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11.5px] text-[#8a6a73]">Missing one? Add it in the Categories tab.</p>
        </div>
        <div>
          <label htmlFor="pf-sku" className={labelClass}>
            SKU {editing ? <span className="font-medium text-[#8a6a73]">(changing it re-identifies the product — tags & WhatsApp history use it)</span> : <span className="font-medium text-[#8a6a73]">(auto-suggested — editable)</span>}
          </label>
          <input
            id="pf-sku"
            className={`${inputClass} font-mono uppercase`}
            value={form.sku}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, sku: e.target.value.toUpperCase(), skuTouched: true }));
              setSkuHint(null);
            }}
            placeholder="NK-OX-001"
            maxLength={24}
          />
          {skuHint && <p className="mt-1 flex items-center gap-1 text-[11.5px] text-gold-700"><Sparkles className="h-3 w-3" /> {skuHint}</p>}
          {!editing && (
            <p className="mt-1 text-[11.5px] text-[#8a6a73]">
              Leave blank to let the server pick the next number when saving.
            </p>
          )}
        </div>
        <div className="lg:col-span-2">
          <span className={labelClass}>Occasion tags — drive the storefront tabs & the SKU style code</span>
          <div className="flex flex-wrap gap-1.5">
            {TAG_PRESETS.map((tag) => {
              const on = form.occasionTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    update(
                      "occasionTags",
                      on ? form.occasionTags.filter((t) => t !== tag) : [...form.occasionTags, tag]
                    )
                  }
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                    on
                      ? "bg-maroon-800 text-gold-200 shadow"
                      : "border border-maroon-800/15 bg-white text-maroon-900 hover:border-maroon-800/35"
                  }`}
                  aria-pressed={on}
                >
                  {tag}
                </button>
              );
            })}
            {form.occasionTags
              .filter((t) => !TAG_PRESETS.includes(t))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => update("occasionTags", form.occasionTags.filter((t) => t !== tag))}
                  className="rounded-full bg-gold-400 px-3 py-1.5 text-[12px] font-bold text-maroon-950 shadow"
                  aria-pressed
                >
                  {tag} ✕
                </button>
              ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className={inputClass}
              value={form.tagDraft}
              onChange={(e) => update("tagDraft", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(form.tagDraft);
                }
              }}
              placeholder="Add a custom tag and press Enter"
              aria-label="Custom occasion tag"
            />
            <button
              type="button"
              onClick={() => addTag(form.tagDraft)}
              className="shrink-0 rounded-2xl border border-maroon-800/20 bg-white px-3.5 text-[13px] font-bold text-maroon-900 transition hover:border-maroon-800/40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="pf-desc" className={labelClass}>Description <span className="font-medium text-[#8a6a73]">(shown under the product name)</span></label>
          <textarea
            id="pf-desc"
            className={`${inputClass} min-h-[84px] resize-y`}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Featherlight oxidised jhumkas that survive 9 nights of garba…"
            maxLength={600}
          />
        </div>
      </section>

      <section className="grid gap-5 rounded-[24px] border border-maroon-800/10 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="pf-price" className={labelClass}>Selling price (₹) *</label>
          <input id="pf-price" type="number" min={0} step={1} className={inputClass} value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="899" required />
        </div>
        <div>
          <label htmlFor="pf-mrp" className={labelClass}>MRP / strikethrough (₹) *</label>
          <input id="pf-mrp" type="number" min={0} step={1} className={inputClass} value={form.mrp} onChange={(e) => update("mrp", e.target.value)} placeholder="1799" required />
          {discount != null && (
            <p className="mt-1 text-[11.5px] font-semibold text-emerald-700">Customer sees “−{discount}% off”</p>
          )}
        </div>
        <div>
          <label htmlFor="pf-cost" className={labelClass}>Cost price (₹) <span className="font-medium text-[#8a6a73]">(admin-only — never shown publicly)</span></label>
          <input id="pf-cost" type="number" min={0} step={1} className={inputClass} value={form.costPrice} onChange={(e) => update("costPrice", e.target.value)} placeholder="330" />
          {form.costPrice !== "" && form.price !== "" && Number(form.costPrice) > 0 && Number(form.price) > Number(form.costPrice) && (
            <p className="mt-1 text-[11.5px] font-semibold text-gold-700">
              Margin ≈ {Math.round(((Number(form.price) - Number(form.costPrice)) / Number(form.price)) * 100)}%
            </p>
          )}
        </div>
        <div>
          <label htmlFor="pf-stock" className={labelClass}>Stock quantity</label>
          <input id="pf-stock" type="number" min={0} step={1} className={inputClass} value={form.stockQty} onChange={(e) => update("stockQty", e.target.value)} placeholder="10" />
        </div>
        <div>
          <label htmlFor="pf-alert" className={labelClass}>Low-stock alert at</label>
          <input id="pf-alert" type="number" min={0} step={1} className={inputClass} value={form.lowStockAlert} onChange={(e) => update("lowStockAlert", e.target.value)} placeholder="3" />
          <p className="mt-1 text-[11.5px] text-[#8a6a73]">The products table highlights anything at or below this.</p>
        </div>
        <div>
          <span className={labelClass}>Colours</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={HEX_COLOR.test(colorDraft) ? (colorDraft.length === 4 ? expandHex(colorDraft) : colorDraft) : "#D4A437"}
              onChange={(e) => setColorDraft(e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-xl border border-maroon-800/15 bg-white p-1"
              aria-label="Pick a colour"
            />
            <button
              type="button"
              onClick={() => {
                const hex = colorDraft.trim().toUpperCase();
                if (HEX_COLOR.test(hex) && !form.colors.includes(hex)) update("colors", [...form.colors, hex]);
              }}
              className="rounded-2xl border border-maroon-800/20 bg-white px-3.5 py-2.5 text-[13px] font-bold text-maroon-900 transition hover:border-maroon-800/40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {form.colors.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {form.colors.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => update("colors", form.colors.filter((x) => x !== c))}
                    className="flex items-center gap-1.5 rounded-full border border-maroon-800/15 bg-white py-1 pl-1.5 pr-2.5 text-[11.5px] font-semibold text-maroon-900"
                    title="Remove colour"
                  >
                    <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                    {c} <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="flex flex-wrap gap-x-8 gap-y-3 rounded-[24px] border border-maroon-800/10 bg-white p-5 shadow-sm">
        {(
          [
            ["isFeatured", "Featured — highlighted on the storefront"],
            ["isBestseller", "Bestseller badge"],
            ["isActive", "Visible on the storefront (un-tick to hide without deleting)"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-2.5 text-[13.5px] font-medium text-maroon-950">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => update(key, e.target.checked)}
              className="h-4 w-4 accent-[#4a0e1c]"
            />
            {label}
          </label>
        ))}
      </section>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium leading-relaxed text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy || uploadsBusy}
          className="inline-flex items-center gap-2 rounded-full bg-maroon-800 px-7 py-3.5 text-[14px] font-bold text-white shadow-lg transition hover:bg-maroon-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {busy ? "Saving…" : editing ? "Save changes" : "Create product"}
        </button>
        <p className="text-[12px] text-[#8a6a73]">
          {editing ? "Nothing is ever hard-deleted — hiding keeps the data." : "You can edit everything later from the products table."}
        </p>
      </div>
    </form>
  );
}

/** "#ABC" → "#AABBCC" — <input type="color"> only accepts 6-digit hex. */
function expandHex(hex: string): string {
  return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toUpperCase();
}

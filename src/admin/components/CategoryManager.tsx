/**
 * src/admin/components/CategoryManager.tsx
 * Full category CRUD from the UI (Block 8): create, edit, deactivate
 * (soft-delete), reactivate, parent/subcategory select and sortOrder.
 *
 * Backend rules this UI must respect (all already enforced server-side — the
 * point here is surfacing them kindly):
 *  - renaming does NOT change the slug (D14); slug changes are a separate field
 *  - duplicate slugs auto-suffix instead of erroring (D15)
 *  - deactivating refuses (409) while the category holds active products (D25);
 *    the owner then gets a confirm() with the backend's own explanation and a
 *    deliberate retry with ?force=true
 *  - a deactivated parent hides its subcategories from the storefront (D17)
 */
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CornerDownRight, Eye, EyeOff, Loader2, Pencil, Plus, Save, X } from "lucide-react";
import {
  createCategory,
  deactivateCategory,
  listCategoriesAdmin,
  updateCategory,
} from "../services/admin.service";
import { apiErrorMessage } from "../../services/api";
import type { ApiCategory } from "../../services/types";

const inputClass =
  "w-full rounded-2xl border border-maroon-800/15 bg-white px-4 py-2.5 text-[14px] text-maroon-950 placeholder:text-[#b49aa1] focus:border-gold-500 focus:outline-none";
const labelClass = "mb-1.5 block text-[12.5px] font-bold text-maroon-950";

interface CategoryFormState {
  id: string | null; // null = create mode
  name: string;
  slug: string; // only sent in create mode, or when explicitly changed in edit mode
  code: string;
  parentCategory: string; // "" = top-level
  sortOrder: string;
  description: string;
}

const emptyCategoryForm: CategoryFormState = {
  id: null,
  name: "",
  slug: "",
  code: "",
  parentCategory: "",
  sortOrder: "0",
  description: "",
};

export function CategoryManager({ onChanged }: { onChanged: () => void }) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState | null>(null); // open form (null = closed)
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listCategoriesAdmin()
      .then((list) => {
        if (!cancelled) setCategories(list);
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
  }, [reloadKey]);

  function startCreate() {
    setFormError(null);
    setForm({ ...emptyCategoryForm });
  }

  function startEdit(c: ApiCategory) {
    setFormError(null);
    setForm({
      id: c.id,
      name: c.name,
      slug: c.slug,
      code: c.code,
      parentCategory: c.parentCategory || "",
      sortOrder: String(c.sortOrder ?? 0),
      description: c.description || "",
    });
  }

  function update<K extends keyof CategoryFormState>(key: K, value: CategoryFormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form || busy) return;
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Category name is required.");
      return;
    }
    setBusy(true);
    try {
      if (form.id === null) {
        await createCategory({
          name: form.name.trim(),
          // slug is optional — the server derives and de-duplicates it (D15)
          ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
          ...(form.code.trim() ? { code: form.code.trim() } : {}),
          parentCategory: form.parentCategory || null,
          sortOrder: Number(form.sortOrder) || 0,
          description: form.description.trim(),
        });
      } else {
        const original = categories.find((c) => c.id === form.id);
        const payload: Parameters<typeof updateCategory>[1] = {
          name: form.name.trim(),
          code: form.code.trim(),
          parentCategory: form.parentCategory || null,
          sortOrder: Number(form.sortOrder) || 0,
          description: form.description.trim(),
        };
        // Only send the slug when it actually changed — renaming must never
        // silently move the category's public URL (D14).
        if (original && form.slug.trim() && form.slug.trim() !== original.slug) {
          payload.slug = form.slug.trim();
        }
        await updateCategory(form.id, payload);
      }
      setForm(null);
      reload();
      onChanged();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(c: ApiCategory) {
    setBusyId(c.id);
    try {
      if (c.isActive) {
        try {
          await deactivateCategory(c.id, false);
        } catch (err) {
          // 409 = the category still holds active products (D25). Show the
          // backend's own explanation, then let the owner force it deliberately.
          const message = apiErrorMessage(err);
          if (/still has .* active product/i.test(message)) {
            const ok = window.confirm(`${message}\n\nHide the category AND those products anyway?`);
            if (ok) await deactivateCategory(c.id, true);
          } else {
            window.alert(message);
          }
        }
      } else {
        await updateCategory(c.id, { isActive: true });
      }
      reload();
      onChanged();
    } catch (err) {
      window.alert(apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  /** Parents must be top-level, ACTIVE categories — and never the row itself. */
  const parentOptions = categories.filter((c) => !c.parentCategory && c.isActive && c.id !== form?.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-[#6b4a52]">
          {categories.filter((c) => c.isActive).length} live • {categories.filter((c) => !c.isActive).length} hidden
          <span className="ml-1 text-[#8a6a73]">— hiding a category hides its products from the storefront too.</span>
        </p>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 rounded-full bg-maroon-800 px-5 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:bg-maroon-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Add category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-[22px] border border-maroon-800/10 bg-white py-14 text-[13.5px] font-medium text-[#8a6a73]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading categories…
        </div>
      ) : error ? (
        <div className="rounded-[22px] border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-[13.5px] font-semibold text-red-700">{error}</p>
          <button onClick={reload} className="mt-3 rounded-full bg-red-600 px-5 py-2 text-[12.5px] font-bold text-white hover:bg-red-500">
            Try again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[22px] border border-maroon-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-maroon-800/10 bg-cream-100/70 text-[11px] font-bold uppercase tracking-wider text-[#8a6a73]">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Slug / Code</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className={`border-b border-maroon-800/8 text-[13px] last:border-0 ${c.isActive ? "" : "bg-cream-100/40 opacity-70"}`}>
                  <td className="px-4 py-3">
                    <p className="flex items-center gap-1.5 font-bold text-maroon-950">
                      {c.isSubcategory && <CornerDownRight className="h-3.5 w-3.5 text-[#8a6a73]" />}
                      {c.name}
                    </p>
                    {c.isSubcategory && c.parentName && (
                      <p className="text-[11px] text-[#8a6a73]">under {c.parentName}</p>
                    )}
                    {c.description && <p className="mt-0.5 max-w-sm truncate text-[11.5px] text-[#8a6a73]" title={c.description}>{c.description}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-[11.5px] text-[#6b4a52]">/{c.slug}</p>
                    <p className="font-mono text-[11px] text-[#8a6a73]">SKU prefix: {c.code || "—"}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-maroon-900">{c.sortOrder}</td>
                  <td className="px-4 py-3">
                    {c.isActive ? (
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
                        onClick={() => startEdit(c)}
                        className="inline-flex items-center gap-1 rounded-full border border-maroon-800/20 bg-white px-3 py-1.5 text-[12px] font-bold text-maroon-900 transition hover:border-maroon-800/45"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      {c.isActive ? (
                        <button
                          onClick={() => toggleActive(c)}
                          disabled={busyId === c.id}
                          className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1.5 text-[12px] font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {busyId === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <EyeOff className="h-3 w-3" />} Hide
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleActive(c)}
                          disabled={busyId === c.id}
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[12px] font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                        >
                          {busyId === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />} Unhide
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* create/edit form */}
      {form && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={form.id ? "Edit category" : "New category"}>
          <div className="absolute inset-0 bg-maroon-950/50 backdrop-blur-sm" onClick={() => !busy && setForm(null)} aria-hidden />
          <form onSubmit={handleSubmit} className="relative w-full max-w-lg space-y-4 rounded-[26px] bg-cream-50 p-6 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-maroon-950">
                {form.id ? "Edit category" : "New category"}
              </h3>
              <button type="button" onClick={() => setForm(null)} disabled={busy} className="grid h-8 w-8 place-items-center rounded-full bg-maroon-800/5 hover:bg-maroon-800/10" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label htmlFor="cm-name" className={labelClass}>Name *</label>
              <input id="cm-name" className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Anklets" required maxLength={80} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cm-slug" className={labelClass}>
                  Slug {form.id && <span className="font-medium text-[#8a6a73]">(changing moves the public URL!)</span>}
                </label>
                <input id="cm-slug" className={`${inputClass} font-mono lowercase`} value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="auto-derived from name" maxLength={100} />
              </div>
              <div>
                <label htmlFor="cm-code" className={labelClass}>SKU code <span className="font-medium text-[#8a6a73]">(max 3 chars)</span></label>
                <input id="cm-code" className={`${inputClass} font-mono uppercase`} value={form.code} onChange={(e) => update("code", e.target.value.slice(0, 3))} placeholder="e.g. AN" maxLength={3} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cm-parent" className={labelClass}>Parent category <span className="font-medium text-[#8a6a73]">(optional)</span></label>
                <select id="cm-parent" className={inputClass} value={form.parentCategory} onChange={(e) => update("parentCategory", e.target.value)}>
                  <option value="">— Top-level —</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cm-order" className={labelClass}>Display order</label>
                <input id="cm-order" type="number" className={inputClass} value={form.sortOrder} onChange={(e) => update("sortOrder", e.target.value)} min={0} step={1} />
              </div>
            </div>
            <div>
              <label htmlFor="cm-desc" className={labelClass}>Description</label>
              <textarea id="cm-desc" className={`${inputClass} min-h-[64px] resize-y`} value={form.description} onChange={(e) => update("description", e.target.value)} maxLength={500} placeholder="What lives on this shelf?" />
            </div>
            {formError && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium leading-relaxed text-red-700" role="alert">{formError}</p>
            )}
            <div className="flex justify-end gap-2.5 pt-1">
              <button type="button" onClick={() => setForm(null)} disabled={busy} className="rounded-full border border-maroon-800/20 bg-white px-5 py-2.5 text-[13px] font-bold text-maroon-900 hover:border-maroon-800/45">
                Cancel
              </button>
              <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-full bg-maroon-800 px-6 py-2.5 text-[13px] font-bold text-white shadow-md hover:bg-maroon-700 disabled:opacity-60">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {form.id ? "Save changes" : "Create category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

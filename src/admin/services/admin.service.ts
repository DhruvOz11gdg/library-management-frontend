/**
 * src/admin/services/admin.service.ts
 * Every admin-panel API call lives here (Block 7/8) — components never touch
 * axios directly. Auth rides on the httpOnly cookie set by POST /admin/login
 * (backend decision D28): no token is ever stored in JS state or localStorage.
 *
 * Endpoints used:
 *   POST /admin/login · POST /admin/logout · GET /admin/self
 *   GET  /admin/stats · GET /admin/products · GET /admin/products/:id
 *   GET  /admin/categories (incl. inactive) · GET /admin/sku-suggestion
 *   POST /products · PUT /products/:id · DELETE /products/:id (soft)
 *   POST /categories · PUT /categories/:id · DELETE /categories/:id (soft, ?force)
 *   POST /upload/product-image (multipart → backend → ImgBB; never ImgBB direct)
 */
import { api, envelopeData } from "../../services/api";
import type {
  ApiAdmin,
  ApiCategory,
  ApiEnvelope,
  ApiListMeta,
  ApiProduct,
  ApiSkuSuggestion,
  ApiStats,
  ApiUploadResult,
} from "../../services/types";

/* ---------------- session ---------------- */

export async function login(email: string, password: string): Promise<ApiAdmin> {
  const res = await api.post<ApiEnvelope<{ admin: ApiAdmin }>>("/admin/login", { email, password });
  return envelopeData(res).admin;
}

export async function logout(): Promise<void> {
  await api.post<ApiEnvelope<null>>("/admin/logout");
}

export async function getSelf(): Promise<ApiAdmin> {
  const res = await api.get<ApiEnvelope<{ admin: ApiAdmin }>>("/admin/self");
  return envelopeData(res).admin;
}

/* ---------------- dashboard ---------------- */

export async function getStats(): Promise<ApiStats> {
  const res = await api.get<ApiEnvelope<ApiStats>>("/admin/stats");
  return envelopeData(res);
}

/* ---------------- products ---------------- */

export interface AdminProductFilters {
  status?: "all" | "active" | "inactive";
  lowStock?: boolean;
  outOfStock?: boolean;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "newest";
}

export async function listProductsAdmin(
  filters: AdminProductFilters = {}
): Promise<{ products: ApiProduct[]; meta: ApiListMeta }> {
  const params: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") params[key] = value;
  }
  const res = await api.get<ApiEnvelope<{ products: ApiProduct[]; meta: ApiListMeta }>>("/admin/products", { params });
  return envelopeData(res);
}

export async function getProductAdmin(idOrSlug: string): Promise<ApiProduct> {
  const res = await api.get<ApiEnvelope<{ product: ApiProduct }>>(`/admin/products/${encodeURIComponent(idOrSlug)}`);
  return envelopeData(res).product;
}

/** Image entry the panel sends when saving a product — never includes deleteUrl. */
export interface ProductImageInput {
  url: string;
  thumbUrl?: string;
  isPrimary?: boolean;
}

export interface ProductPayload {
  /** leave empty on create to let the backend auto-generate */
  sku?: string;
  name: string;
  /** category slug or id */
  category: string;
  occasionTags?: string[];
  description?: string;
  price: number;
  mrp: number;
  costPrice?: number;
  stockQty?: number;
  lowStockAlert?: number;
  colors?: string[];
  images?: ProductImageInput[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isActive?: boolean;
  /** SKU style hint, e.g. the first occasion tag */
  styleHint?: string;
}

export async function createProduct(payload: ProductPayload): Promise<ApiProduct> {
  const res = await api.post<ApiEnvelope<{ product: ApiProduct }>>("/products", payload);
  return envelopeData(res).product;
}

export async function updateProduct(id: string, payload: Partial<ProductPayload>): Promise<ApiProduct> {
  const res = await api.put<ApiEnvelope<{ product: ApiProduct }>>(`/products/${encodeURIComponent(id)}`, payload);
  return envelopeData(res).product;
}

/** Soft delete — the backend sets isActive:false; nothing is ever destroyed. */
export async function deleteProduct(id: string): Promise<ApiProduct> {
  const res = await api.delete<ApiEnvelope<{ product: ApiProduct }>>(`/products/${encodeURIComponent(id)}`);
  return envelopeData(res).product;
}

export async function getSkuSuggestion(category: string, styleHint = ""): Promise<ApiSkuSuggestion> {
  const res = await api.get<ApiEnvelope<ApiSkuSuggestion>>("/admin/sku-suggestion", {
    params: { category, ...(styleHint ? { styleHint } : {}) },
  });
  return envelopeData(res);
}

/* ---------------- categories ---------------- */

/** Admin list — includes INACTIVE categories (the public endpoint hides them). */
export async function listCategoriesAdmin(): Promise<ApiCategory[]> {
  const res = await api.get<ApiEnvelope<{ categories: ApiCategory[]; count: number }>>("/admin/categories");
  return envelopeData(res).categories;
}

export interface CategoryPayload {
  name: string;
  slug?: string;
  code?: string;
  description?: string;
  parentCategory?: string | null;
  image?: { url: string; thumbUrl: string };
  sortOrder?: number;
  isActive?: boolean;
}

export async function createCategory(payload: CategoryPayload): Promise<ApiCategory> {
  const res = await api.post<ApiEnvelope<{ category: ApiCategory }>>("/categories", payload);
  return envelopeData(res).category;
}

export async function updateCategory(id: string, payload: Partial<CategoryPayload>): Promise<ApiCategory> {
  const res = await api.put<ApiEnvelope<{ category: ApiCategory }>>(`/categories/${encodeURIComponent(id)}`, payload);
  return envelopeData(res).category;
}

/**
 * Soft delete. The backend refuses (409) while the category still holds active
 * products; `force: true` is the owner's deliberate "hide the whole shelf".
 */
export async function deactivateCategory(id: string, force = false): Promise<ApiCategory> {
  const res = await api.delete<ApiEnvelope<{ category: ApiCategory }>>(
    `/categories/${encodeURIComponent(id)}${force ? "?force=true" : ""}`
  );
  return envelopeData(res).category;
}

/* ---------------- image upload ---------------- */

/**
 * One file per call, exactly as the backend's multer middleware expects
 * (field name "image"). Uploads run frontend → backend → ImgBB; the ImgBB key
 * never reaches this repo. Long timeout: phone photos on shop wifi.
 */
export async function uploadProductImage(file: File, nameHint?: string): Promise<ApiUploadResult> {
  const form = new FormData();
  form.append("image", file);
  if (nameHint) form.append("name", nameHint);
  const res = await api.post<ApiEnvelope<ApiUploadResult>>("/upload/product-image", form, {
    timeout: 120_000,
  });
  return envelopeData(res);
}

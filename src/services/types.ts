/**
 * src/services/types.ts
 * The exact JSON shapes alankar-backend returns under its standard
 * `{ success, message, data }` envelope (see backend utils/apiResponse.js).
 * Typed once here so every service unwraps the same way — the frontend never
 * guesses at a field name.
 */

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown[];
}

/* ---------------- categories ---------------- */

export interface ApiCategory {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  /** 3-char SKU prefix, e.g. "NK" */
  code: string;
  description: string;
  image: { url: string; thumbUrl: string };
  parentCategory: string | null;
  parentSlug: string | null;
  parentName: string | null;
  isSubcategory: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ---------------- products ---------------- */

export interface ApiCategorySummary {
  id: string;
  name: string;
  slug: string;
  code: string;
}

export interface ApiProductImage {
  url: string;
  thumbUrl: string;
  isPrimary: boolean;
  position: number;
  /** present on the ADMIN shape only — never on public responses */
  deleteUrl?: string;
}

/** Public product shape (backend decision D27: `images[]` + convenience `image`/`thumbUrl`). */
export interface ApiProduct {
  id: string;
  _id?: string;
  sku: string;
  name: string;
  slug: string;
  category: ApiCategorySummary | null;
  categoryId: string | null;
  occasionTags: string[];
  description: string;
  price: number;
  mrp: number;
  discountPercent: number;
  image: string;
  thumbUrl: string;
  images: ApiProductImage[];
  colors: string[];
  stockQty: number;
  inStock: boolean;
  isLowStock: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /* --- admin-only additions (GET /admin/products, /admin/products/:id) --- */
  costPrice?: number;
  lowStockAlert?: number;
  margin?: number | null;
}

export interface ApiListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  sort: string;
  searchMode: string;
  filters?: Record<string, unknown>;
}

/* ---------------- admin ---------------- */

export interface ApiAdmin {
  id: string;
  _id?: string;
  email: string;
  name: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiStats {
  total: number;
  active: number;
  inactive: number;
  outOfStock: number;
  lowStock: number;
  featured: number;
  bestsellers: number;
  byCategory: { categoryId: string; name: string; slug: string; count: number }[];
}

export interface ApiUploadResult {
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  size: number;
  originalSize: number;
  savedPercent: number;
  format: string;
  uploadId: string;
}

export interface ApiSkuSuggestion {
  suggestion: string;
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  styleHint: string;
  note: string;
}

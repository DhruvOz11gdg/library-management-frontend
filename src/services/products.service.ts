/**
 * src/services/products.service.ts
 * Storefront product reads: GET /v1/products and GET /v1/products/:slug.
 *
 * This file also owns `mapApiProduct` — the single translation point between
 * the backend's product JSON and the `Product` type the existing components
 * already render (data.ts). Backend decision D27 exposed both `images[]` and
 * the convenience `image`/`thumbUrl` fields precisely so this mapping could
 * happen without a backend change.
 *
 * Fields the database does not store yet (rating, reviews) map to `undefined`
 * and the components hide those bits — we never invent numbers and present
 * them as "verified buyer" stats.
 */
import { api, envelopeData } from "./api";
import type { ApiEnvelope, ApiListMeta, ApiProduct } from "./types";
import type { Product, ProductCategory } from "../data";

export type ProductSort = "price_asc" | "price_desc" | "newest";

export interface ProductFilters {
  /** category slug, e.g. "necklace" */
  category?: string;
  /** occasion tag, e.g. "navratri" */
  occasion?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  bestseller?: boolean;
  page?: number;
  limit?: number;
  sort?: ProductSort;
}

/* ------------------------------------------------------------------ *
 * Backend product → storefront Product
 * ------------------------------------------------------------------ */

/** Occasion tags that map onto each Showcase tab (checked in this priority). */
const TAB_TAGS: [ProductCategory, string[]][] = [
  ["Wedding", ["wedding", "bridal", "shaadi", "dulhan"]],
  ["Navratri", ["navratri", "garba", "dandiya", "festive"]],
  ["Daily", ["daily", "everyday", "office", "casual"]],
  ["Fashion", ["fashion", "party", "nightout"]],
];

/** Fallback when a product has no recognised occasion tag: use its category. */
const TAB_BY_CATEGORY_SLUG: Record<string, ProductCategory> = {
  "bridal-sets": "Wedding",
  "navratri-oxidised": "Navratri",
  watches: "Fashion",
};

export function deriveCategoryTab(p: ApiProduct): ProductCategory {
  const tags = (p.occasionTags || []).map((t) => String(t).toLowerCase());
  for (const [tab, matches] of TAB_TAGS) {
    if (matches.some((m) => tags.includes(m))) return tab;
    if (matches.some((m) => tags.some((t) => t.includes(m)))) return tab;
  }
  const slug = p.category?.slug || "";
  return TAB_BY_CATEGORY_SLUG[slug] ?? "Fashion";
}

/** "New" for anything added in the last 14 days. */
function isNew(createdAt: string): boolean {
  const created = Date.parse(createdAt);
  return Number.isFinite(created) && Date.now() - created < 14 * 24 * 60 * 60 * 1000;
}

export function deriveBadge(p: ApiProduct): string | undefined {
  if (p.isBestseller) return "Bestseller";
  if (p.isFeatured) return "Featured";
  if (isNew(p.createdAt)) return "New";
  return undefined;
}

export function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    category: deriveCategoryTab(p),
    categoryName: p.category?.name || "Alankar",
    price: p.price,
    mrp: p.mrp,
    // The database has no review system yet. `rating`/`reviews` are optional on
    // Product and the components hide that row when they are absent — we never
    // invent numbers and label them "verified buyer" stats.
    image: p.image || p.images?.[0]?.url || "",
    thumbUrl: p.thumbUrl || p.images?.[0]?.thumbUrl || p.image || "",
    badge: deriveBadge(p),
    blurb: p.description || "",
    colors: p.colors || [],
    occasionTags: p.occasionTags || [],
    inStock: p.inStock,
    isFeatured: p.isFeatured,
    isBestseller: p.isBestseller,
  };
}

/* ------------------------------------------------------------------ *
 * Endpoints
 * ------------------------------------------------------------------ */

export interface ProductsPage {
  products: Product[];
  meta: ApiListMeta;
}

/** GET /v1/products — active products in active categories, standard envelope. */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsPage> {
  const params: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") params[key] = value;
  }
  const res = await api.get<ApiEnvelope<{ products: ApiProduct[]; meta: ApiListMeta }>>("/products", { params });
  const data = envelopeData(res);
  return { products: (data.products || []).map(mapApiProduct), meta: data.meta };
}

/** GET /v1/products/:slug — the backend accepts a slug OR a SKU here. */
export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await api.get<ApiEnvelope<{ product: ApiProduct }>>(`/products/${encodeURIComponent(slug)}`);
  return mapApiProduct(envelopeData(res).product);
}

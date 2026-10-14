/**
 * src/services/categories.service.ts
 * Storefront category reads: GET /v1/categories (active categories only,
 * already sorted by the owner's `sortOrder`, subcategories hidden when their
 * parent is inactive).
 *
 * The admin panel has its own call (GET /v1/admin/categories) because it must
 * also see inactive categories — see src/admin/services/admin.service.ts.
 */
import { api, envelopeData } from "./api";
import type { ApiCategory, ApiEnvelope } from "./types";

/** GET /v1/categories */
export async function getCategories(): Promise<ApiCategory[]> {
  const res = await api.get<ApiEnvelope<{ categories: ApiCategory[]; count: number }>>("/categories");
  return envelopeData(res).categories || [];
}

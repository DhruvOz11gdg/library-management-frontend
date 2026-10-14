/**
 * Block 6 acceptance test — the mapping between the backend's product JSON and
 * the `Product` shape the existing storefront components render.
 *
 * This is the seam where a live shop breaks silently: a wrong tab assignment
 * hides a product from the "Navratri" filter during the busiest sales window
 * of the year, and a missing image URL shows a broken card. Both are checked
 * against the real backend response shape here.
 *
 * Run: npm test   (vitest)
 */
import { describe, expect, it } from "vitest";
import type { ApiProduct } from "./types";
import { deriveBadge, deriveCategoryTab, mapApiProduct } from "./products.service";

/** A response exactly as GET /v1/products returns it (backend toPublicProduct). */
function api(overrides: Partial<ApiProduct> = {}): ApiProduct {
  return {
    id: "6aadb510d6ec2416b74cdf29",
    _id: "6aadb510d6ec2416b74cdf29",
    sku: "OX-NA-001",
    name: "Dandiya Nights Mirror Choker",
    slug: "dandiya-nights-mirror-choker",
    category: { id: "cat1", name: "Navratri/Oxidised", slug: "navratri-oxidised", code: "OX" },
    categoryId: "cat1",
    occasionTags: ["navratri", "festive", "garba"],
    description: "Mirror + threadwork choker made for chaniya choli.",
    price: 899,
    mrp: 1799,
    discountPercent: 50,
    image: "https://i.ibb.co/abc/choker.jpg",
    thumbUrl: "https://i.ibb.co/abc/choker-thumb.jpg",
    images: [
      {
        url: "https://i.ibb.co/abc/choker.jpg",
        thumbUrl: "https://i.ibb.co/abc/choker-thumb.jpg",
        isPrimary: true,
        position: 0,
      },
    ],
    colors: ["#E35D7C", "#1A936F"],
    stockQty: 18,
    inStock: true,
    isLowStock: false,
    isFeatured: false,
    isBestseller: true,
    isActive: true,
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
    ...overrides,
  };
}

describe("deriveCategoryTab — which storefront tab a product lands on", () => {
  it("maps the four storefront tabs from occasion tags", () => {
    expect(deriveCategoryTab(api({ occasionTags: ["daily", "office"] }))).toBe("Daily");
    expect(deriveCategoryTab(api({ occasionTags: ["fashion", "party"] }))).toBe("Fashion");
    expect(deriveCategoryTab(api({ occasionTags: ["wedding", "bridal"] }))).toBe("Wedding");
    expect(deriveCategoryTab(api({ occasionTags: ["navratri", "garba"] }))).toBe("Navratri");
  });

  it("lets wedding win when a piece is tagged for several occasions", () => {
    expect(deriveCategoryTab(api({ occasionTags: ["navratri", "wedding", "daily"] }))).toBe("Wedding");
  });

  it("falls back to the database category when no occasion tag is recognised", () => {
    expect(
      deriveCategoryTab(
        api({
          occasionTags: [],
          category: { id: "c", name: "Bridal Sets", slug: "bridal-sets", code: "BS" },
        })
      )
    ).toBe("Wedding");
    expect(
      deriveCategoryTab(
        api({
          occasionTags: [],
          category: { id: "c", name: "Navratri/Oxidised", slug: "navratri-oxidised", code: "OX" },
        })
      )
    ).toBe("Navratri");
    expect(deriveCategoryTab(api({ occasionTags: [], category: null }))).toBe("Fashion");
  });

  it("never returns a value outside the tab list (tabs would silently drop it)", () => {
    const allowed = ["Daily", "Fashion", "Wedding", "Navratri"];
    for (const tags of [[], ["unknown"], [" office "], ["GARBA"], ["shaadi"], ["nightout"]]) {
      expect(allowed).toContain(deriveCategoryTab(api({ occasionTags: tags })));
    }
  });
});

describe("deriveBadge", () => {
  it("prefers Bestseller, then Featured, then New", () => {
    expect(deriveBadge(api({ isBestseller: true, isFeatured: true }))).toBe("Bestseller");
    expect(deriveBadge(api({ isBestseller: false, isFeatured: true }))).toBe("Featured");
    expect(deriveBadge(api({ isBestseller: false, isFeatured: false, createdAt: new Date().toISOString() }))).toBe("New");
  });

  it("does not badge an old, unflagged product", () => {
    expect(deriveBadge(api({ isBestseller: false, isFeatured: false, createdAt: "2025-01-01T00:00:00.000Z" }))).toBeUndefined();
  });
});

describe("mapApiProduct — the shape components actually render", () => {
  it("carries every field the product card and QuickView read", () => {
    const p = mapApiProduct(api());
    expect(p).toMatchObject({
      id: "6aadb510d6ec2416b74cdf29",
      sku: "OX-NA-001", // Block 9 prints this in the WhatsApp order
      name: "Dandiya Nights Mirror Choker",
      slug: "dandiya-nights-mirror-choker",
      category: "Navratri",
      categoryName: "Navratri/Oxidised",
      price: 899,
      mrp: 1799,
      image: "https://i.ibb.co/abc/choker.jpg",
      thumbUrl: "https://i.ibb.co/abc/choker-thumb.jpg",
      blurb: "Mirror + threadwork choker made for chaniya choli.",
      badge: "Bestseller",
      colors: ["#E35D7C", "#1A936F"],
      inStock: true,
      isBestseller: true,
    });
  });

  it("leaves rating/reviews undefined so the UI hides them instead of inventing stats", () => {
    const p = mapApiProduct(api());
    expect(p.rating).toBeUndefined();
    expect(p.reviews).toBeUndefined();
  });

  it("falls back through images[] when the convenience fields are empty", () => {
    const p = mapApiProduct(
      api({
        image: "",
        thumbUrl: "",
        images: [{ url: "https://i.ibb.co/x/full.jpg", thumbUrl: "https://i.ibb.co/x/t.jpg", isPrimary: true, position: 0 }],
      })
    );
    expect(p.image).toBe("https://i.ibb.co/x/full.jpg");
    expect(p.thumbUrl).toBe("https://i.ibb.co/x/t.jpg");
  });

  it("survives a photo-less product without crashing the card", () => {
    const p = mapApiProduct(api({ image: "", thumbUrl: "", images: [] }));
    expect(p.image).toBe("");
    expect(p.thumbUrl).toBe("");
  });

  it("tolerates a product whose category was force-hidden (category: null)", () => {
    const p = mapApiProduct(api({ category: null, categoryId: null }));
    expect(p.categoryName).toBe("Alankar");
    expect(p.category).toBe("Navratri"); // still tagged navratri
  });

  it("normalises missing arrays instead of throwing on .map in JSX", () => {
    const p = mapApiProduct(api({ colors: undefined as unknown as string[], occasionTags: undefined as unknown as string[] }));
    expect(p.colors).toEqual([]);
    expect(p.occasionTags).toEqual([]);
  });
});

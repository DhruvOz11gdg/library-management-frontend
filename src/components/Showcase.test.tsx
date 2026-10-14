// @vitest-environment jsdom
/**
 * Block 6 acceptance test (UI level) — the Showcase's new data-driven states.
 *
 * What this locks in:
 *  - while fetching: a skeleton grid, no stale/fake products
 *  - backend down: a readable error + "Try again" that actually re-fetches
 *  - empty catalogue / empty tab: friendly empty states, not a blank hole
 *  - with products: cards render the REAL fields (name, price, MRP, badge),
 *    tab filtering works, Add to Bag / Quick view / wishlist fire with the
 *    right product, and the stars row is GONE while the backend has no
 *    ratings (no invented "verified buyer" numbers)
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Showcase } from "./SectionsMid";
import type { Product } from "../data";

// Vitest globals are off, so Testing Library cannot auto-register cleanup —
// without this, every render accumulates in the same jsdom document.
afterEach(cleanup);

/* framer-motion needs these in jsdom (Reveal uses whileInView → IntersectionObserver) */
beforeAll(() => {
  class IntersectionObserverStub {
    constructor(_cb: unknown) {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
});

const choker: Product = {
  id: "id-1",
  sku: "OX-NA-001",
  name: "Dandiya Nights Mirror Choker",
  category: "Navratri",
  categoryName: "Navratri/Oxidised",
  slug: "dandiya-nights-mirror-choker",
  price: 899,
  mrp: 1799,
  image: "https://i.ibb.co/abc/choker.jpg",
  thumbUrl: "https://i.ibb.co/abc/choker-thumb.jpg",
  badge: "Bestseller",
  blurb: "Mirror + threadwork choker made for chaniya choli.",
  colors: ["#E35D7C"],
  inStock: true,
  isBestseller: true,
  isFeatured: false,
};
const pendant: Product = {
  id: "id-2",
  sku: "NK-DA-001",
  name: "Meher Minimal Pendant",
  category: "Daily",
  categoryName: "Necklace",
  slug: "meher-minimal-pendant",
  price: 699,
  mrp: 1299,
  image: "https://i.ibb.co/def/pendant.jpg",
  blurb: "Featherlight pendant for office to errands.",
  colors: ["#D4A437"],
  inStock: true,
  isBestseller: false,
  isFeatured: false,
};

function renderShowcase(overrides: Partial<Parameters<typeof Showcase>[0]> = {}) {
  const props = {
    products: [] as Product[],
    loading: false,
    error: null as string | null,
    onRetry: vi.fn(),
    onAdd: vi.fn(),
    wishlist: new Set<string>(),
    onWish: vi.fn(),
    onQuick: vi.fn(),
    ...overrides,
  };
  render(<Showcase {...props} />);
  return props;
}

describe("Showcase — fetch states (Block 6)", () => {
  it("shows a skeleton grid while loading, and no product cards", () => {
    renderShowcase({ loading: true });
    expect(screen.getByLabelText("Loading the collection")).toBeTruthy();
    expect(screen.queryByText("Dandiya Nights Mirror Choker")).toBeNull();
  });

  it("shows the backend's error with a working Try again button", () => {
    const props = renderShowcase({ error: "Cannot reach the Alankar API at /api — is the backend running?" });
    expect(screen.getByText("We couldn't load the collection")).toBeTruthy();
    expect(screen.getByText(/Cannot reach the Alankar API/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(props.onRetry).toHaveBeenCalledOnce();
  });

  it("shows a friendly empty state when the catalogue is empty", () => {
    renderShowcase();
    expect(screen.getByText("The collection is being polished")).toBeTruthy();
  });

  it("shows a tab-specific empty state when a filter matches nothing", () => {
    renderShowcase({ products: [choker] });
    fireEvent.click(screen.getByRole("tab", { name: "Wedding" }));
    expect(screen.getByText("No Wedding pieces right now")).toBeTruthy();
  });
});

describe("Showcase — live catalogue rendering", () => {
  it("renders real product data: name, price, strikethrough MRP, discount and badge", () => {
    renderShowcase({ products: [choker] });
    expect(screen.getByText("Dandiya Nights Mirror Choker")).toBeTruthy();
    expect(screen.getByText("₹899")).toBeTruthy();
    expect(screen.getByText("₹1,799")).toBeTruthy();
    expect(screen.getByText("-50%")).toBeTruthy();
    expect(screen.getByText("Bestseller")).toBeTruthy();
  });

  it("renders NO stars/reviews row while the backend has no ratings", () => {
    renderShowcase({ products: [choker, pendant] });
    expect(screen.queryByLabelText("5 star rating")).toBeNull();
    expect(screen.queryByText(/\(\d[\d,]*\)/)).toBeNull();
  });

  it("filters by tab client-side exactly like the static version did", async () => {
    renderShowcase({ products: [choker, pendant] });
    fireEvent.click(screen.getByRole("tab", { name: "Daily" }));
    expect(screen.getByText("Meher Minimal Pendant")).toBeTruthy();
    // The filtered-out card leaves through AnimatePresence's exit animation,
    // so it unmounts a few frames later rather than synchronously.
    await waitFor(() => expect(screen.queryByText("Dandiya Nights Mirror Choker")).toBeNull());
  });

  it("Add to Bag hands the full product (with sku) to the cart", () => {
    const onAdd = vi.fn();
    renderShowcase({ products: [choker], onAdd });
    fireEvent.click(screen.getAllByRole("button", { name: /add to bag/i })[0]);
    expect(onAdd).toHaveBeenCalledWith(choker);
    expect((onAdd.mock.calls[0][0] as Product).sku).toBe("OX-NA-001");
  });

  it("Quick view opens from the photo, wishlist toggles with the product id", () => {
    const props = renderShowcase({ products: [choker] });
    fireEvent.click(screen.getByAltText("Dandiya Nights Mirror Choker"));
    expect(props.onQuick).toHaveBeenCalledWith(choker);
    fireEvent.click(screen.getByRole("button", { name: /add dandiya nights mirror choker to wishlist/i }));
    expect(props.onWish).toHaveBeenCalledWith("id-1");
  });

  it("counts what is actually on screen — no more hardcoded 500+", () => {
    renderShowcase({ products: [choker, pendant] });
    expect(screen.getByText(/Showing 2 designs/)).toBeTruthy();
    expect(screen.queryByText(/500\+/)).toBeNull();
  });
});

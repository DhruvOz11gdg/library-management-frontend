/**
 * Block 9 acceptance test — the WhatsApp order message is the single most
 * business-critical string in the app (a wrong SKU or total = a wrong order),
 * so it is verified character by character, not eyeballed once.
 *
 * Run: npm test   (vitest)
 */
import { afterEach, describe, expect, it, vi } from "vitest";

// env.ts reads import.meta.env at module load — stub BEFORE importing, and
// reset the module registry so the service picks the stubbed values up.
vi.stubEnv("VITE_WHATSAPP_NUMBER", "919586171580");
vi.stubEnv("VITE_API_BASE_URL", "/api");
vi.resetModules();

const { buildWhatsappMessage, openWhatsappCheckout } = await import("./whatsappCheckout.service");

const openSpy = vi.fn<(...args: unknown[]) => Window | null>(() => ({}) as unknown as Window);
const alertSpy = vi.fn();
vi.stubGlobal("window", { open: openSpy, alert: alertSpy });

afterEach(() => {
  openSpy.mockClear();
  openSpy.mockImplementation(() => ({}) as unknown as Window);
  alertSpy.mockClear();
});

const pendant = {
  id: "p1",
  sku: "NK-DA-001",
  name: "Meher Minimal Pendant — 18K Gold Dipped",
  price: 699,
  image: "https://i.ibb.co/example/pendant.jpg",
  qty: 2,
};
const jhumkas = {
  id: "p2",
  sku: "ER-NA-001",
  name: "Garba Glow Oxidised Jhumkas",
  price: 499,
  image: "https://i.ibb.co/example/jhumkas.jpg",
  qty: 1,
};
const festiveBox = {
  // curated combo box from the Pricing section — NOT a database product
  id: "Festive & Navratri Edit",
  name: "Festive & Navratri Edit Box",
  price: 2999,
  image: "https://images.pexels.com/photos/29038003/box.jpeg",
  qty: 1,
};

describe("buildWhatsappMessage", () => {
  it("greets, numbers the items and prints SKU, qty maths and photo link", () => {
    const msg = buildWhatsappMessage([pendant, jhumkas], 1897);
    expect(msg.startsWith("Hi Alankar! I want to order:\n\n")).toBe(true);
    expect(msg).toContain("1. *Meher Minimal Pendant — 18K Gold Dipped* (SKU: NK-DA-001)");
    expect(msg).toContain("   Qty: 2 × ₹699 = ₹1,398");
    expect(msg).toContain("   Photo: https://i.ibb.co/example/pendant.jpg");
    expect(msg).toContain("2. *Garba Glow Oxidised Jhumkas* (SKU: ER-NA-001)");
    expect(msg).toContain("   Qty: 1 × ₹499 = ₹499");
  });

  it("formats Indian-style comma totals and ends asking for availability", () => {
    const msg = buildWhatsappMessage([pendant, jhumkas], 1897);
    expect(msg).toContain("*Total: ₹1,897*");
    expect(msg.endsWith("Please confirm availability 🙏")).toBe(true);
  });

  it("adds the shipping line only when shipping is charged", () => {
    const withShipping = buildWhatsappMessage([jhumkas], 578, { shipping: 79 });
    expect(withShipping).toContain("Shipping: ₹79");
    expect(withShipping).toContain("*Total: ₹578*");
    expect(withShipping.indexOf("Shipping: ₹79")).toBeLessThan(withShipping.indexOf("*Total:"));
    const freeShip = buildWhatsappMessage([pendant], 1398, { shipping: 0 });
    expect(freeShip).not.toContain("Shipping:");
  });

  it("omits the SKU bracket for combo boxes that have no SKU", () => {
    const msg = buildWhatsappMessage([festiveBox], 3078, { shipping: 79 });
    expect(msg).toContain("1. *Festive & Navratri Edit Box*");
    expect(msg).not.toContain("(SKU:");
    expect(msg).toContain("   Photo: https://images.pexels.com/photos/29038003/box.jpeg");
  });
});

describe("openWhatsappCheckout", () => {
  it("opens wa.me with the store number and the URL-encoded message, in a new tab", () => {
    const ok = openWhatsappCheckout([pendant, jhumkas], 1897);
    expect(ok).toBe(true);
    expect(openSpy).toHaveBeenCalledOnce();
    const [url, target, features] = openSpy.mock.calls[0];
    const expectedText = encodeURIComponent(buildWhatsappMessage([pendant, jhumkas], 1897));
    expect(url).toBe(`https://wa.me/919586171580?text=${expectedText}`);
    expect(target).toBe("_blank");
    expect(String(features)).toContain("noopener");
  });

  it("does nothing on an empty bag", () => {
    expect(openWhatsappCheckout([], 0)).toBe(false);
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("tells the customer when the popup is blocked instead of failing silently", () => {
    openSpy.mockImplementation(() => null);
    expect(openWhatsappCheckout([jhumkas], 499)).toBe(false);
    expect(alertSpy).toHaveBeenCalledOnce();
    expect(alertSpy.mock.calls[0][0]).toMatch(/blocked the WhatsApp popup/i);
  });
});

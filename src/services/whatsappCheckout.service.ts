/**
 * src/services/whatsappCheckout.service.ts
 * The core deliverable (Block 9): turn the cart into a WhatsApp order message
 * and open wa.me with it prefilled. No payment gateway — the owner confirms
 * availability and collects payment over WhatsApp himself.
 *
 * Message format (from the project spec):
 *   Hi Alankar! I want to order:
 *
 *   1. *Peacock Choker* (SKU: NK-OX-001)
 *      Qty: 2 × ₹899 = ₹1,798
 *      Photo: https://i.ibb.co/....jpg
 *
 *   Shipping: ₹79            ← only when the cart is under the free-ship bar
 *   *Total: ₹1,877*
 *
 *   Please confirm availability 🙏
 *
 * wa.me can only prefill TEXT — it cannot attach media. Because every product
 * photo lives on ImgBB with a public URL, the tappable "Photo:" link is the
 * closest thing to sending the image, exactly as the spec reasons.
 *
 * Items are typed structurally (not imported from the component) so this
 * service never depends on UI code; CartItem in SectionsBottom.tsx satisfies
 * this shape. `sku` is optional because the curated combo boxes added by the
 * Pricing section are not database products and have no SKU.
 */
import { env } from "../config/env";
import { inr } from "../data";

export interface WhatsappCheckoutItem {
  name: string;
  sku?: string;
  qty: number;
  price: number;
  image?: string;
}

export function buildWhatsappMessage(
  items: WhatsappCheckoutItem[],
  total: number,
  opts: { shipping?: number } = {}
): string {
  const lines = items.map((item, i) => {
    const head = `${i + 1}. *${item.name}*${item.sku ? ` (SKU: ${item.sku})` : ""}`;
    const qty = `   Qty: ${item.qty} × ${inr(item.price)} = ${inr(item.qty * item.price)}`;
    const photo = item.image ? `   Photo: ${item.image}` : null;
    return photo ? `${head}\n${qty}\n${photo}` : `${head}\n${qty}`;
  });
  const shipping = opts.shipping && opts.shipping > 0 ? [`Shipping: ${inr(opts.shipping)}`] : [];
  return [
    "Hi Alankar! I want to order:",
    "",
    ...lines,
    "",
    ...shipping,
    `*Total: ${inr(total)}*`,
    "",
    "Please confirm availability 🙏",
  ].join("\n");
}

/**
 * Builds the message and opens wa.me in a new tab. Returns true when the
 * window opened; false means misconfiguration or a popup blocker — either way
 * the caller (CartDrawer) tells the customer instead of failing silently and
 * losing the order.
 */
export function openWhatsappCheckout(
  items: WhatsappCheckoutItem[],
  total: number,
  opts: { shipping?: number } = {}
): boolean {
  if (items.length === 0) return false;
  if (!env.hasWhatsapp) {
    // env.ts already console.error'd the setup instructions at boot.
    window.alert(
      "WhatsApp checkout is not configured yet (VITE_WHATSAPP_NUMBER is missing in the frontend .env). " +
        "Tell the shop owner so orders are not lost."
    );
    return false;
  }
  const message = buildWhatsappMessage(items, total, opts);
  const url = `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.alert("Your browser blocked the WhatsApp popup — allow popups for this site and tap Checkout again.");
    return false;
  }
  return true;
}

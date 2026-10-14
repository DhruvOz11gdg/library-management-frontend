/**
 * src/config/env.ts
 * The only place that reads `import.meta.env`. Every other module imports from
 * here, so a missing variable produces one clear console.error naming the file
 * to fix — instead of a silent `undefined` turning into a broken fetch URL or a
 * `wa.me/undefined` link that loses an order.
 *
 * Both values are public by design (Vite inlines anything prefixed `VITE_`).
 * The ImgBB key is NEVER here — uploads go frontend → backend → ImgBB.
 */

function read(key: "VITE_API_BASE_URL" | "VITE_WHATSAPP_NUMBER"): string {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
}

const apiBaseUrl = read("VITE_API_BASE_URL");
const whatsappNumber = read("VITE_WHATSAPP_NUMBER");

if (!apiBaseUrl) {
  console.error(
    "[alankar env] VITE_API_BASE_URL is not set — the storefront cannot load products.\n" +
      "  Create alankar-premium-jewelry-landing-page/.env with:\n" +
      "    VITE_API_BASE_URL=http://localhost:5001/v1\n" +
      "  (or copy .env.sample). Then restart `npm run dev` — Vite reads .env only at boot."
  );
}

/** wa.me wants digits only: no "+", no spaces, country code included. */
const normalizedWhatsapp = whatsappNumber.replace(/[^\d]/g, "");

if (!normalizedWhatsapp) {
  console.error(
    "[alankar env] VITE_WHATSAPP_NUMBER is not set — the cart's checkout button cannot open WhatsApp.\n" +
      "  Put the store's number in international format, digits only, in .env:\n" +
      "    VITE_WHATSAPP_NUMBER=919586171580\n" +
      "  Then restart `npm run dev`."
  );
} else if (normalizedWhatsapp.length < 10 || normalizedWhatsapp.length > 15) {
  console.error(
    `[alankar env] VITE_WHATSAPP_NUMBER "${normalizedWhatsapp}" looks wrong — expected 10–15 digits ` +
      "including the country code (e.g. 919586171580). Orders would open a dead WhatsApp link."
  );
}

export const env = {
  /** e.g. "http://localhost:5001/v1" or "https://api.alankar.me/v1" */
  apiBaseUrl,
  /** digits only, e.g. "919586171580" */
  whatsappNumber: normalizedWhatsapp,
  hasApi: Boolean(apiBaseUrl),
  hasWhatsapp: Boolean(normalizedWhatsapp),
} as const;

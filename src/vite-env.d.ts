/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API base URL, e.g. "http://localhost:5001/v1" or "/api" (dev proxy) */
  readonly VITE_API_BASE_URL?: string;
  /** Store WhatsApp number, digits only with country code, e.g. "919586171580" */
  readonly VITE_WHATSAPP_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

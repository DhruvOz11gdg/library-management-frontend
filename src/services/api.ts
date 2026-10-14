/**
 * src/services/api.ts
 * One axios instance for the whole app — components never call fetch/axios
 * directly (the separation-of-concerns rule the legacy Services/ folder taught).
 *
 * `withCredentials: true` matters for the admin panel: the backend keeps the
 * JWT in an httpOnly cookie (backend decision D28), which is only sent when
 * credentials are enabled. It is harmless for the public storefront calls.
 */
import axios, { type AxiosError } from "axios";
import { env } from "../config/env";
import type { ApiEnvelope } from "./types";

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: 30_000,
  headers: { Accept: "application/json" },
});

/**
 * Turns any axios failure into one human-readable line — the backend already
 * writes owner-friendly messages ("MRP cannot be less than the selling price…"),
 * so prefer the envelope's `message` and fall back to network-level text.
 */
export function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<ApiEnvelope<unknown>>;
    const envelopeMessage = axiosErr.response?.data?.message;
    if (typeof envelopeMessage === "string" && envelopeMessage) return envelopeMessage;
    if (axiosErr.code === "ECONNABORTED") return "The request timed out — is the backend still running?";
    if (axiosErr.code === "ERR_NETWORK")
      return `Cannot reach the Alankar API at ${env.apiBaseUrl || "(no URL configured)"} — is the backend running?`;
    return axiosErr.message || "Request failed";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

/** Unwraps `{ success, message, data }` — every endpoint uses this envelope. */
export function envelopeData<T>(res: { data: ApiEnvelope<T> }): T {
  return res.data.data;
}

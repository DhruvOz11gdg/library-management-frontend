/**
 * src/admin/AdminLogin.tsx
 * The single-admin sign-in (Block 7). There is deliberately no register form —
 * the account comes from `npm run seed:admin` on the backend (golden rule: a
 * jewellery storefront has no business exposing public admin signup).
 *
 * The backend throttles FAILED attempts only (10 per 15 min, D29), so a busy
 * owner can never lock himself out by signing in often.
 */
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, LogIn, Sparkles } from "lucide-react";
import { apiErrorMessage } from "../services/api";

export function AdminLogin({
  onSignIn,
}: {
  onSignIn: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter both your email and password.");
      return;
    }
    setBusy(true);
    try {
      await onSignIn(email.trim(), password);
      // AdminRoutes flips to "authed" and the router swaps this page for the
      // dashboard (the login route renders <Navigate to="/admin"> once signed in).
    } catch (err) {
      setError(apiErrorMessage(err));
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-cream-50 px-4 py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff1de] via-cream-50 to-cream-50" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold-400/20 blur-[90px]" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-maroon-800/10 blur-[90px]" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="rounded-[28px] border border-maroon-800/10 bg-white p-7 shadow-[0_30px_70px_-30px_rgba(74,14,28,0.45)] sm:p-9">
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-maroon-950 shadow-lg">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="font-display block text-xl font-bold text-maroon-950">Alankar Admin</span>
              <span className="block text-[10.5px] font-semibold uppercase tracking-[0.22em] text-gold-700">
                Products • Stock • Images
              </span>
            </span>
          </div>
          <h1 className="font-display mt-6 text-2xl font-semibold text-maroon-950">Sign in</h1>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[#6b4a52]">
            Use the admin email and password set up with <code className="rounded bg-cream-100 px-1.5 py-0.5 font-mono text-[12px] text-maroon-800">npm run seed:admin</code>.
          </p>
          <form className="mt-5 space-y-3.5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-[12.5px] font-bold text-maroon-950">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@alankar.me"
                className="w-full rounded-2xl border border-maroon-800/15 bg-white px-4 py-3 text-[14px] text-maroon-950 placeholder:text-[#b49aa1] focus:border-gold-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-[12.5px] font-bold text-maroon-950">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-maroon-800/15 bg-white px-4 py-3 text-[14px] text-maroon-950 placeholder:text-[#b49aa1] focus:border-gold-500 focus:outline-none"
                required
              />
            </div>
            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium leading-relaxed text-red-700" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-maroon-800 py-3.5 text-[14.5px] font-bold text-white shadow-lg transition hover:bg-maroon-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Sign in
                </>
              )}
            </button>
          </form>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[#8a6a73]">
            <Lock className="h-3.5 w-3.5 text-emerald-600" /> Your session stays in a locked (httpOnly) cookie —
            never in the browser's JS.
          </p>
        </div>
        <div className="mt-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-maroon-800/15 bg-white px-5 py-2.5 text-[13px] font-semibold text-maroon-900 shadow-sm transition hover:border-maroon-800/30"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to the store
          </Link>
        </div>
      </div>
    </div>
  );
}

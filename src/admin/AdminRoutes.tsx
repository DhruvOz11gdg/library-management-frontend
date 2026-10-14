/**
 * src/admin/AdminRoutes.tsx
 * Auth gate for /admin/* (Block 7).
 *
 * On mount: GET /v1/admin/self. The backend answers from the httpOnly cookie,
 * so there is no token in JS state to lose or steal — a page refresh simply
 * re-asks the server "am I still signed in?".
 *
 *   checking → splash
 *   anon     → /admin/login (AdminLogin)
 *   authed   → AdminDashboard
 */
import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getSelf, login as loginCall, logout as logoutCall } from "./services/admin.service";
import type { ApiAdmin } from "../services/types";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

type Session = "checking" | "authed" | "anon";

function AdminSplash({ label }: { label: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-cream-50">
      <div className="flex flex-col items-center gap-3">
        <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-maroon-800/20 border-t-maroon-800" aria-hidden />
        <p className="text-[13px] font-medium text-[#8a6a73]">{label}</p>
      </div>
    </div>
  );
}

export function AdminRoutes() {
  const [session, setSession] = useState<Session>("checking");
  const [admin, setAdmin] = useState<ApiAdmin | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSelf()
      .then((me) => {
        if (cancelled) return;
        setAdmin(me);
        setSession("authed");
      })
      .catch(() => {
        if (!cancelled) setSession("anon");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const me = await loginCall(email, password);
    setAdmin(me);
    setSession("authed");
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutCall();
    } finally {
      // Even if the network call failed, drop the local session — the cookie is
      // cleared server-side on any successful call, and "checking" on next mount
      // re-establishes the truth.
      setAdmin(null);
      setSession("anon");
    }
  }, []);

  if (session === "checking") return <AdminSplash label="Checking your session…" />;

  return (
    <Routes>
      <Route
        path="login"
        element={session === "authed" ? <Navigate to="/admin" replace /> : <AdminLogin onSignIn={signIn} />}
      />
      <Route
        path="*"
        element={
          session === "authed" && admin ? (
            <AdminDashboard admin={admin} onSignOut={signOut} />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
    </Routes>
  );
}

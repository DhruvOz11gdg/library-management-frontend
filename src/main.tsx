import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AdminRoutes } from "./admin/AdminRoutes";
/**
 * Block 7: the app gains a router. The existing landing page keeps its exact
 * component tree at "/" (App.tsx is unchanged apart from the data wiring);
 * everything under /admin is new code in src/admin/.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

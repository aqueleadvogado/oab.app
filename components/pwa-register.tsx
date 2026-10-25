"use client";

import { useEffect } from "react";

/**
 * Registra o Service Worker em produção. Em desenvolvimento o SW é
 * mantido desligado para o Next.js servir sempre fresco.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const registrar = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          // Não quebra a página se registrar falhar — só loga.
          console.warn("[pwa] falha ao registrar service worker:", err);
        });
    };

    if (document.readyState === "complete") {
      registrar();
    } else {
      window.addEventListener("load", registrar, { once: true });
    }
  }, []);

  return null;
}

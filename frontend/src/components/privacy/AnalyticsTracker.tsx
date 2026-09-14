"use client";

import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from "react";

export function AnalyticsTracker() {
  const location = useLocation();
  const pathname = location.pathname;
  const lastTracked = useRef("");

  useEffect(() => {
    if (!pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    let visitorId = localStorage.getItem("ke-anonymous-visitor-id");
    if (!visitorId) {
      visitorId = typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("ke-anonymous-visitor-id", visitorId);
    }
    void fetch("/api/analytics/visit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pagePath: pathname, visitorId }), keepalive: true }).catch(() => undefined);
  }, [pathname]);

  return null;
}

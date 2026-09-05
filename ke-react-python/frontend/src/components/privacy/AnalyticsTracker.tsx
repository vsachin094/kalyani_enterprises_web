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
    void fetch("/api/analytics/visit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pagePath: pathname }), keepalive: true }).catch(() => undefined);
  }, [pathname]);

  return null;
}
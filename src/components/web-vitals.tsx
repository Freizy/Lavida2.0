"use client";

import { useEffect } from "react";

type Metric = {
  name: string;
  delta: number;
  id: string;
};

function sendToAnalytics(metric: Metric) {
  if (process.env.NODE_ENV !== "production") return;

  const body = JSON.stringify({
    name: metric.name,
    value: metric.delta,
    id: metric.id,
    page: window.location.pathname,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/vitals", body);
  }
}

export function WebVitals() {
  useEffect(() => {
    import("web-vitals")
      .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS(sendToAnalytics);
        onINP(sendToAnalytics);
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
      })
      .catch(() => {
        // web-vitals not available in dev/test
      });
  }, []);

  return null;
}

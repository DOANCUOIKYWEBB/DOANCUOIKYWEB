"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
      } catch {
        // Không làm gián đoạn app nếu service worker đăng ký lỗi
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}
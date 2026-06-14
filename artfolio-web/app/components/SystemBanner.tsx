"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { getApiUrl } from "../utils/apiConfig";

type Banner = {
  _id: string;
  message: string;
  type: "info" | "warning" | "success" | "danger";
  active: boolean;
  createdAt: string;
};

const STYLES: Record<Banner["type"], { wrapper: string; icon: React.ReactNode }> = {
  info: {
    wrapper:
      "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200",
    icon: <Info className="h-4 w-4 shrink-0" />,
  },
  success: {
    wrapper:
      "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-200",
    icon: <CheckCircle2 className="h-4 w-4 shrink-0" />,
  },
  warning: {
    wrapper:
      "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-200",
    icon: <AlertTriangle className="h-4 w-4 shrink-0" />,
  },
  danger: {
    wrapper:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200",
    icon: <XCircle className="h-4 w-4 shrink-0" />,
  },
};

export default function SystemBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchBanners = async () => {
      try {
        const res = await fetch(getApiUrl("banners/active"), {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted) {
          setBanners(Array.isArray(json.data) ? json.data : []);
        }
      } catch {
        // Lỗi tải banner không quan trọng, bỏ qua
      }
    };

    fetchBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleBanners = banners.filter((b) => !dismissed.includes(b._id));

  if (visibleBanners.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 px-4 pt-3">
      {visibleBanners.map((banner) => {
        const style = STYLES[banner.type] ?? STYLES.info;
        return (
          <div
            key={banner._id}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${style.wrapper}`}
          >
            {style.icon}
            <span className="flex-1">{banner.message}</span>
            <button
              type="button"
              onClick={() => setDismissed((prev) => [...prev, banner._id])}
              className="rounded-md p-0.5 opacity-70 transition hover:opacity-100"
              aria-label="Đóng thông báo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

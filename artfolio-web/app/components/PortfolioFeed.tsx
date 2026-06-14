"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Heart, Loader2, Eye } from "lucide-react";
import PortfolioModalShell from "./PortfolioModalShell";
import PortfolioDetailClient from "../portfolio/[id]/PortfolioDetailClient";
import type { PortfolioCategory, PortfolioSummary } from "../types/api";
import { normalizePortfolio, type RawPortfolio } from "../data/portfolios";
import { getApiUrl } from "../utils/apiConfig";

type PortfolioFeedProps = {
  portfolios: PortfolioSummary[];
  isLoading?: boolean;
  errorMessage?: string;
};

const categoryLabels: Record<PortfolioCategory | "all", string> = {
  all: "Tất cả",
  design: "Design",
  art: "Art",
  photo: "Photo",
  "3d": "3D",
  other: "Other",
};

const PAGE_SIZE = 12;

function FeedSlide({
  portfolio,
  onOpen,
}: {
  portfolio: PortfolioSummary;
  onOpen: (id: string) => void;
}) {
  const authorName = portfolio.user?.name || "Unknown user";
  const authorInitial = authorName.slice(0, 1).toUpperCase();

  return (
    <section className="feed-slide relative flex h-[100dvh] w-full shrink-0 snap-start snap-always items-center justify-center bg-black">
      {/* Background mờ phủ toàn màn hình, lấp khoảng trống 2 bên */}
      <div className="absolute inset-0">
        <Image
          src={portfolio.images?.[0] || "/next.svg"}
          alt=""
          fill
          sizes="100vw"
          priority={false}
          className="object-cover opacity-60 blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Khối nội dung căn giữa, giới hạn chiều rộng */}
      <div className="relative z-10 mx-auto h-full w-full max-w-[480px]">
        <div className="absolute inset-0">
          <Image
            src={portfolio.images?.[0] || "/next.svg"}
            alt={portfolio.title}
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            priority={false}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
        </div>

        <button
          type="button"
          onClick={() => onOpen(portfolio._id)}
          className="absolute inset-0 cursor-pointer"
          aria-label={`Xem chi tiết tác phẩm ${portfolio.title}`}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-5 pb-8 sm:p-8">
          <span className="pointer-events-auto inline-flex w-fit items-center rounded-full glass bg-white/10 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
            {categoryLabels[portfolio.category] || portfolio.category}
          </span>

          <h2 className="text-2xl font-extrabold text-white drop-shadow-lg sm:text-3xl">
            {portfolio.title}
          </h2>

          <div className="flex items-center gap-3">
            {portfolio.user?.avatar && portfolio.user.avatar !== "default-avatar.png" ? (
              <img
                src={portfolio.user.avatar}
                alt={authorName}
                className="h-9 w-9 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-white bg-primary text-xs font-bold text-white uppercase">
                {authorInitial}
              </span>
            )}
            <span className="text-sm font-semibold text-white drop-shadow-md">{authorName}</span>
          </div>

          {portfolio.tags && portfolio.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {portfolio.tags.slice(0, 4).map((t) => (
                <span key={t} className="text-xs font-medium text-white/80">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pointer-events-auto absolute right-3 bottom-24 z-10 flex flex-col items-center gap-5 sm:right-5">
          <button
            type="button"
            onClick={() => onOpen(portfolio._id)}
            className="flex flex-col items-center gap-1 text-white"
            aria-label="Xem like"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur-md transition hover:bg-white/25">
              <Heart className="h-6 w-6" />
            </span>
            <span className="text-xs font-bold drop-shadow-md">{portfolio.likesCount || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpen(portfolio._id)}
            className="flex flex-col items-center gap-1 text-white"
            aria-label="Xem chi tiết"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur-md transition hover:bg-white/25">
              <Eye className="h-6 w-6" />
            </span>
            <span className="text-xs font-bold drop-shadow-md">Xem</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default function PortfolioFeed({
  portfolios: initialPortfolios,
  isLoading = false,
  errorMessage,
}: PortfolioFeedProps) {
  const [allPortfolios, setAllPortfolios] = useState<PortfolioSummary[]>(initialPortfolios);
  const [prevInitialPortfolios, setPrevInitialPortfolios] = useState(initialPortfolios);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [likeOverrides, setLikeOverrides] = useState<Record<string, number>>({});
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Đồng bộ allPortfolios khi prop initialPortfolios thay đổi (không dùng effect
  // để tránh cascading render — điều chỉnh state ngay trong lúc render).
  if (initialPortfolios !== prevInitialPortfolios) {
    setPrevInitialPortfolios(initialPortfolios);
    setAllPortfolios(initialPortfolios);
  }

  const fetchMore = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(getApiUrl(`portfolios?page=${nextPage}&limit=${PAGE_SIZE}`));
      if (!res.ok) throw new Error();
      const json = await res.json();
      const rawData: RawPortfolio[] = Array.isArray(json.data) ? json.data : [];
      const normalized = rawData.map(normalizePortfolio);
      if (normalized.length === 0 || nextPage >= (json.totalPages ?? 1)) {
        setHasMore(false);
      }
      setAllPortfolios((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        return [...prev, ...normalized.filter((p) => !ids.has(p._id))];
      });
      setPage(nextPage);
    } catch {
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMore, page]);

  useEffect(() => {
    const el = loaderRef.current;
    const root = containerRef.current;
    if (!el || !root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { root, threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchMore]);

  useEffect(() => {
    function handlePortfolioLikeChanged(event: Event) {
      const customEvent = event as CustomEvent<{ portfolioId?: string; likesCount?: number }>;
      const portfolioId = customEvent.detail?.portfolioId;
      const likesCount = customEvent.detail?.likesCount;
      if (!portfolioId || typeof likesCount !== "number") return;
      setLikeOverrides((current) => ({ ...current, [portfolioId]: likesCount }));
    }
    window.addEventListener("artfolio:portfolio-like-changed", handlePortfolioLikeChanged);
    return () =>
      window.removeEventListener("artfolio:portfolio-like-changed", handlePortfolioLikeChanged);
  }, []);

  const displayPortfolios = useMemo(
    () =>
      allPortfolios.map((portfolio) => {
        const likesCount = likeOverrides[portfolio._id];
        return typeof likesCount === "number" ? { ...portfolio, likesCount } : portfolio;
      }),
    [allPortfolios, likeOverrides]
  );

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex h-[100dvh] items-center justify-center p-8 text-center text-sm font-semibold text-danger">
        {errorMessage}
      </div>
    );
  }

  if (displayPortfolios.length === 0) {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center p-8 text-center">
        <Eye className="mb-4 h-10 w-10 text-muted" />
        <h2 className="text-xl font-bold">Chưa có tác phẩm nào</h2>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="feed-container h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain"
      >
        {displayPortfolios.map((portfolio) => (
          <FeedSlide key={portfolio._id} portfolio={portfolio} onOpen={setSelectedPortfolioId} />
        ))}

        {hasMore && (
          <div
            ref={loaderRef}
            className="flex h-[100dvh] w-full shrink-0 snap-start items-center justify-center"
          >
            {isFetchingMore && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          </div>
        )}
      </div>

      {selectedPortfolioId && (
        <PortfolioModalShell onClose={() => setSelectedPortfolioId(null)}>
          <PortfolioDetailClient
            key={selectedPortfolioId}
            portfolioId={selectedPortfolioId}
            mode="modal"
          />
        </PortfolioModalShell>
      )}
    </>
  );
}

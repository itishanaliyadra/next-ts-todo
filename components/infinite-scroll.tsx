"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type InfiniteScrollProps = {
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  children: ReactNode;
};

export default function InfiniteScroll({
  hasMore,
  loading,
  loadingMore,
  onLoadMore,
  children,
}: InfiniteScrollProps) {
  const ticking = useRef(false);
  const loadRequested = useRef(false);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  const loadingMoreRef = useRef(loadingMore);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    hasMoreRef.current = hasMore;
    loadingRef.current = loading;
    loadingMoreRef.current = loadingMore;
    onLoadMoreRef.current = onLoadMore;

    if (!loadingMore) {
      loadRequested.current = false;
    }
  }, [hasMore, loading, loadingMore, onLoadMore]);

  useEffect(() => {
    const checkBottom = () => {
      if (ticking.current) {
        return;
      }

      ticking.current = true;

      window.requestAnimationFrame(() => {
        ticking.current = false;

        if (
          !hasMoreRef.current ||
          loadingRef.current ||
          loadingMoreRef.current ||
          loadRequested.current
        ) {
          return;
        }

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const distanceFromBottom = documentHeight - (scrollTop + viewportHeight);

        if (distanceFromBottom < 280) {
          loadRequested.current = true;
          onLoadMoreRef.current();
        }
      });
    };

    checkBottom();
    window.addEventListener("scroll", checkBottom, { passive: true });
    window.addEventListener("resize", checkBottom);

    return () => {
      window.removeEventListener("scroll", checkBottom);
      window.removeEventListener("resize", checkBottom);
    };
  }, []);

  return (
    <div className="grid gap-4">
      {children}

      {hasMore ? (
        <div className="flex items-center justify-center py-4">
          {loadingMore ? (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
              Loading more todos
            </div>
          ) : (
            <div className="h-6" />
          )}
        </div>
      ) : (
        <div className="py-4 text-center text-sm text-slate-400">
          You&apos;ve reached the end of the list.
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import WatchlistGrid from "./WatchlistGrid";
import { useAnimeWatchlist } from "@/hooks/api/watchlistHooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { WatchStatus } from "@/types/watchlist";

const FilteredWatchlist = ({ status }: { status?: WatchStatus }) => {
  const [startCursor, setStartCursor] = useState("");
  const [endCursor, setEndCursor] = useState("");
  const [direction, setDirection] = useState<"prev" | "next">("next");
  const { data, isLoading, isPlaceholderData } = useAnimeWatchlist({
    limit: 25,
    startCursor: startCursor,
    endCursor: endCursor,
    direction: direction,
    status: status,
  });
  const watchlistItems = data?.data ?? [];
  const prevPageCursor = data?.pagination.prevPageCursor ?? "";
  const nextPageCursor = data?.pagination.nextPageCursor ?? "";

  useEffect(() => {
    setStartCursor("");
    setEndCursor("");
    setDirection("next");
  }, [status]);

  return (
    <>
      <WatchlistGrid
        watchlistItems={watchlistItems}
        isLoading={isLoading || isPlaceholderData}
      />
      {data && (data.pagination.hasPrevPage || data.pagination.hasNextPage) && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href=""
                onClick={() => {
                  if (!data?.pagination.hasPrevPage) return;
                  setStartCursor("");
                  setEndCursor(prevPageCursor);
                  setDirection("prev");
                }}
                className={`${
                  data?.pagination.hasPrevPage
                    ? "cursor-pointer"
                    : "pointer-events-none opacity-50"
                }`}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href=""
                onClick={() => {
                  if (!data?.pagination.hasNextPage) return;
                  setStartCursor(nextPageCursor);
                  setEndCursor("");
                  setDirection("next");
                }}
                className={`${
                  data?.pagination.hasNextPage
                    ? "cursor-pointer"
                    : "pointer-events-none opacity-50"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default React.memo(FilteredWatchlist);

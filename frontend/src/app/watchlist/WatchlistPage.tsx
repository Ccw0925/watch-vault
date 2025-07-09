"use client";
import { TypographyH3 } from "@/components/ui/typography";
import WatchlistGrid from "@/components/watchlist/WatchlistGrid";
import { useAnimeWatchlist } from "@/hooks/api/watchlistHooks";
import { Bookmark } from "lucide-react";
import React from "react";

const WatchlistPage = () => {
  const { data: watchlistItems, isLoading } = useAnimeWatchlist();

  return (
    <div className="p-5 lg:p-8 mx-auto w-full max-w-[1850px] font-inter">
      <div className="flex gap-2 mb-5 lg:mb-8 items-center justify-center lg:justify-start">
        <Bookmark className="md:h-8 md:w-8 h-7 w-7" />
        <TypographyH3 className="md:text-4xl text-3xl font-bold">
          My Watchlist
        </TypographyH3>
      </div>

      <WatchlistGrid
        watchlistItems={watchlistItems ?? []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default WatchlistPage;

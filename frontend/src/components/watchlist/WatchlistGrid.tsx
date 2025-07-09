import React from "react";
import WatchlistGridItem, { ContentSkeleton } from "./WatchlistGridItem";
import { WatchlistItem } from "@/types/watchlist";
import { TypographyH3 } from "../ui/typography";
import Link from "next/link";

const WatchlistGrid = ({
  watchlistItems,
  isLoading,
}: {
  watchlistItems: WatchlistItem[];
  isLoading: boolean;
}) => {
  return isLoading ? (
    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,236px)] lg:justify-between gap-5 justify-center">
      <ContentSkeleton />
    </div>
  ) : watchlistItems?.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,236px)] lg:justify-between gap-5 justify-center">
      {watchlistItems?.map((watchlistItem, i) => (
        <WatchlistGridItem key={i} watchlistItem={watchlistItem} />
      ))}
    </div>
  ) : (
    <>
      <TypographyH3 className="text-center mb-3 text-muted-foreground text-lg md:text-2xl">
        Zero anime? That&apos;s more tragic than a{" "}
        <Link
          href="animes/genre/27?name=Shounen"
          className="underline underline-offset-2 hover:text-blue-500"
        >
          Shounen
        </Link>{" "}
        protagonist&apos;s backstory. 😭
      </TypographyH3>
      <TypographyH3 className="text-center text-muted-foreground text-lg md:text-2xl">
        Let&apos;s fix this—discover your next obsession!
      </TypographyH3>
    </>
  );
};

export default WatchlistGrid;

"use client";
import { TypographyH3 } from "@/components/ui/typography";
import WatchlistGrid from "@/components/watchlist/WatchlistGrid";
import { useAnimeWatchlist } from "@/hooks/api/watchlistHooks";
import { StatusDisplayMap, WatchStatus } from "@/types/watchlist";
import { Bookmark } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WatchlistPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { data: watchlistItems, isLoading } = useAnimeWatchlist();
  const planToWatchList = watchlistItems?.filter(
    (item) => item.status === WatchStatus.PlanToWatch
  );
  const watchingList = watchlistItems?.filter(
    (item) => item.status === WatchStatus.Watching
  );
  const finishedWatchingList = watchlistItems?.filter(
    (item) => item.status === WatchStatus.FinishedWatching
  );
  const mobileViewWatchlist = useMemo(() => {
    if (!watchlistItems) return [];

    switch (selectedStatus) {
      case WatchStatus.PlanToWatch:
        return planToWatchList;
      case WatchStatus.Watching:
        return watchingList;
      case WatchStatus.FinishedWatching:
        return finishedWatchingList;
      default:
        return watchlistItems;
    }
  }, [
    watchlistItems,
    selectedStatus,
    planToWatchList,
    watchingList,
    finishedWatchingList,
  ]);

  return (
    <div className="p-5 lg:p-8 mx-auto w-full max-w-[1850px] font-inter">
      <div className="flex gap-2 mb-5 lg:mb-8 items-center justify-center lg:justify-start">
        <Bookmark className="md:h-8 md:w-8 h-7 w-7" />
        <TypographyH3 className="md:text-4xl text-3xl font-bold">
          My Watchlist
        </TypographyH3>
      </div>

      <Tabs defaultValue="all" className="hidden md:flex">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="cursor-pointer">
            All
          </TabsTrigger>
          <TabsTrigger value="planToWatch" className="cursor-pointer">
            {StatusDisplayMap[WatchStatus.PlanToWatch]}
          </TabsTrigger>
          <TabsTrigger value="watching" className="cursor-pointer">
            {StatusDisplayMap[WatchStatus.Watching]}
          </TabsTrigger>
          <TabsTrigger value="finishedWatching" className="cursor-pointer">
            {StatusDisplayMap[WatchStatus.FinishedWatching]}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-5">
          <WatchlistGrid
            watchlistItems={watchlistItems ?? []}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="planToWatch" className="pt-5">
          <WatchlistGrid
            watchlistItems={planToWatchList ?? []}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="watching" className="pt-5">
          <WatchlistGrid
            watchlistItems={watchingList ?? []}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="finishedWatching" className="pt-5">
          <WatchlistGrid
            watchlistItems={finishedWatchingList ?? []}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="flex md:hidden w-full font-inter">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent className="font-inter">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value={WatchStatus.PlanToWatch}>
            {StatusDisplayMap[WatchStatus.PlanToWatch]}
          </SelectItem>
          <SelectItem value={WatchStatus.Watching}>
            {StatusDisplayMap[WatchStatus.Watching]}
          </SelectItem>
          <SelectItem value={WatchStatus.FinishedWatching}>
            {StatusDisplayMap[WatchStatus.FinishedWatching]}
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="block md:hidden mt-5">
        <WatchlistGrid
          watchlistItems={mobileViewWatchlist ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default WatchlistPage;

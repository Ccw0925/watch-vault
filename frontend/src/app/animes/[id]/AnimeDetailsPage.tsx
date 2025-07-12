"use client";
import AnimeCharactersGroup from "@/components/anime/AnimeCharactersGroup";
import AnimeEpisodesGroup from "@/components/anime/AnimeEpisodesGroup";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH1 } from "@/components/ui/typography";
import { useAnimeById } from "@/hooks/api/animeHooks";
import { List, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WatchlistButton from "@/components/anime/WatchlistButton";
import { WatchStatus } from "@/types/watchlist";
import AnimePrequelSequelGroup from "@/components/anime/details/AnimePrequelSequelGroup";
import AnimeTitleInfo from "@/components/anime/details/AnimeTitleInfo";
import AnimeStatsBadges from "@/components/anime/details/AnimeStatsBadges";
import AnimeSynopsis from "@/components/anime/details/AnimeSynopsis";
import AnimeInfoCardGroup from "@/components/anime/details/AnimeInfoCardGroup";
import StudiosInfo from "@/components/anime/details/StudiosInfo";
import ProducersInfo from "@/components/anime/details/ProducersInfo";
import TrailerModal from "@/components/anime/details/TrailerModal";
import GenresInfo from "@/components/anime/details/GenresInfo";
import ThemesInfo from "@/components/anime/details/ThemesInfo";
import DemographicsInfo from "@/components/anime/details/DemographicsInfo";
import ImageInfoGroup from "@/components/anime/details/ImageInfoGroup";

const AnimeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: anime, isLoading } = useAnimeById(id);
  const [showMore, setShowMore] = useState(false);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const synopsisRef = useRef<HTMLParagraphElement>(null);
  const [inWatchlist, setInWatchlist] = useState(anime?.inWatchlist ?? false);
  const [watchlistStatus, setWatchlistStatus] = useState(
    anime?.watchlistStatus ?? WatchStatus.PlanToWatch
  );
  const [watchlistProgress, setWatchlistProgress] = useState(
    anime?.watchlistProgress ?? 1
  );

  useEffect(() => {
    setInWatchlist(anime?.inWatchlist ?? false);
    setWatchlistStatus(anime?.watchlistStatus ?? WatchStatus.PlanToWatch);
    setWatchlistProgress(anime?.watchlistProgress ?? 1);
  }, [anime]);

  const handleAddOrRemoveFromWatchlist = (newStatus: boolean) => {
    setInWatchlist(newStatus);

    if (newStatus) setWatchlistStatus(WatchStatus.PlanToWatch);
  };

  const handleStatusChange = (newStatus: WatchStatus) => {
    setWatchlistStatus(newStatus);

    if (newStatus === WatchStatus.Watching) {
      setWatchlistProgress(1);
    }
  };

  const handleProgressChange = (newProgress: number) => {
    setWatchlistProgress(newProgress);

    const lastEpisode = anime?.episodes ?? 0;
    if (lastEpisode && newProgress === anime?.episodes) {
      setWatchlistStatus(WatchStatus.FinishedWatching);
    }
  };

  const checkTextOverflow = useCallback(() => {
    if (synopsisRef.current) {
      const lineHeight = parseInt(
        getComputedStyle(synopsisRef.current).lineHeight
      );
      const maxHeight = lineHeight * 7;
      const actualHeight = synopsisRef.current.scrollHeight;

      setShouldShowMore(actualHeight > maxHeight);
    }
  }, []);

  useEffect(() => {
    checkTextOverflow();

    const debouncedCheck = debounce(checkTextOverflow, 200);
    window.addEventListener("resize", debouncedCheck);

    return () => {
      window.removeEventListener("resize", debouncedCheck);
    };
  }, [checkTextOverflow, anime?.synopsis]);

  const debounce = (func: () => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(), wait);
    };
  };

  if (!isLoading && !anime)
    return (
      <div className="mt-5">
        <TypographyH1 className="text-center">Anime not found.</TypographyH1>
        <Link href="/animes" className="flex justify-center mt-5">
          <Button className="font-inter text-white cursor-pointer">
            Back to Anime List
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="p-5 lg:p-8 flex flex-col mx-auto w-full max-w-[1850px]">
      <div className="flex mb-8 justify-between">
        <BackButton redirectUrl="/animes/top" />
        {anime && (
          <WatchlistButton
            id={anime.id}
            inWatchlist={inWatchlist}
            disabled={isLoading}
            onWatchlistChange={handleAddOrRemoveFromWatchlist}
          />
        )}
      </div>

      {isLoading || anime === undefined ? (
        <PageSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_350px] gap-5 lg:gap-10 mb-8">
            <AnimePrequelSequelGroup
              relations={anime.relations}
              classname="lg:hidden grid"
            />

            <div className="lg:col-span-2 space-y-6 order-2 lg:order-none">
              <AnimePrequelSequelGroup
                relations={anime.relations}
                classname="hidden lg:grid"
              />
              <AnimeTitleInfo anime={anime} />
              <AnimeStatsBadges anime={anime} />
              <AnimeSynopsis
                synopsis={anime.synopsis}
                shouldShowMore={shouldShowMore}
                showMore={showMore}
                setShowMore={setShowMore}
                synopsisRef={synopsisRef}
              />
              <AnimeInfoCardGroup anime={anime} />
              <StudiosInfo studios={anime.studios} />
              <ProducersInfo producers={anime.producers} />
              <GenresInfo genres={anime.genres} />
              <ThemesInfo themes={anime.themes} />
              <DemographicsInfo demographics={anime.demographics} />
            </div>

            <div className="relative order-1 lg:order-none">
              <ImageInfoGroup
                id={anime.id}
                images={anime.images}
                url={anime.url}
                trailer={anime.trailer}
                episodes={anime.episodes}
                inWatchlist={inWatchlist}
                watchlistStatus={watchlistStatus}
                watchlistProgress={watchlistProgress}
                setIsTrailerModalOpen={setIsTrailerModalOpen}
                setWatchlistStatus={handleStatusChange}
                setWatchlistProgress={handleProgressChange}
              />
            </div>
          </div>

          <Tabs defaultValue="episodes">
            <TabsList className="w-full">
              <TabsTrigger value="episodes" className="cursor-pointer">
                <List /> Episodes
              </TabsTrigger>
              <TabsTrigger value="characters" className="cursor-pointer">
                <Users /> Characters
              </TabsTrigger>
            </TabsList>
            <TabsContent value="episodes">
              <AnimeEpisodesGroup id={id} />
            </TabsContent>
            <TabsContent value="characters">
              <AnimeCharactersGroup id={id} />
            </TabsContent>
          </Tabs>

          <TrailerModal
            trailer={anime.trailer}
            isOpen={isTrailerModalOpen}
            setIsOpen={setIsTrailerModalOpen}
          />
        </>
      )}
    </div>
  );
};

const PageSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_350px] gap-8 mb-12">
    <div className="lg:col-span-2 space-y-6 order-2 lg:order-none">
      <Skeleton className="h-9 w-[25%]" />
      <Skeleton className="h-5 w-[15%]" />
      <Skeleton className="h-5 w-[20%]" />
      <Skeleton className="h-[180px]" />
    </div>
    <div className="relative order-1 lg:order-none">
      <div className="sticky top-8 flex flex-col gap-4 h-[600px] max-w-[350px] mx-auto lg:mx-0">
        <div className="relative w-full h-[85%] rounded-xl overflow-hidden">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default AnimeDetailsPage;

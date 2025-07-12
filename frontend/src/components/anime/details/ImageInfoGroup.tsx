import { Button } from '@/components/ui/button';
import ProgressField from '@/components/watchlist/ProgressField';
import StatusSelect from '@/components/watchlist/StatusSelect';
import { Anime } from '@/types/anime';
import { WatchStatus } from '@/types/watchlist';
import { Play, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react'

const ImageInfoGroup = ({
  id,
  images,
  url,
  trailer,
  episodes,
  inWatchlist,
  watchlistStatus,
  watchlistProgress,
  setIsTrailerModalOpen,
  setWatchlistStatus,
  setWatchlistProgress,
}: Pick<
  Anime,
  | "id"
  | "images"
  | "url"
  | "trailer"
  | "episodes"
  | "inWatchlist"
  | "watchlistStatus"
  | "watchlistProgress"
> & {
  setIsTrailerModalOpen: Dispatch<SetStateAction<boolean>>;
  setWatchlistStatus: (newStatus: WatchStatus) => void;
  setWatchlistProgress: (newProgress: number) => void;
}) => (
  <div
    className={`sticky top-8 flex flex-col gap-4 max-w-[350px] mx-auto lg:mx-0 ${
      inWatchlist
        ? watchlistStatus === WatchStatus.Watching
          ? "h-[700px]"
          : "h-[640px]"
        : "h-[600px]"
    }`}
  >
    <div className="relative w-full h-[85%] rounded-xl overflow-hidden">
      <Image
        src={images.webp.large_image_url}
        alt="Anime Poster"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 350px"
        priority
      />
    </div>
    <div className="flex gap-3">
      {trailer.youtube_id && (
        <div className="flex-1">
          <Button
            className="font-inter w-full dark:bg-input/30 dark:hover:bg-input/50 font-medium text-white cursor-pointer h-12 rounded-xl"
            onClick={() => setIsTrailerModalOpen(true)}
          >
            <Play />
            Watch Trailer
          </Button>
        </div>
      )}
      <div className="flex-1">
        <Link href={url} target="_blank">
          <Button className="font-inter w-full dark:bg-input/30 dark:hover:bg-input/50 font-medium text-white cursor-pointer h-12 rounded-xl">
            <SquareArrowOutUpRight />
            MyAnimeList
          </Button>
        </Link>
      </div>
    </div>
    {inWatchlist && (
      <>
        <StatusSelect
          animeId={id}
          currentStatus={watchlistStatus}
          currentProgress={watchlistProgress}
          onChange={setWatchlistStatus}
        />

        {watchlistStatus === WatchStatus.Watching && (
          <ProgressField
            animeId={id}
            lastEpisode={episodes}
            currentProgress={watchlistProgress}
            currentStatus={watchlistStatus}
            onSave={setWatchlistProgress}
          />
        )}
      </>
    )}
  </div>
);

export default ImageInfoGroup
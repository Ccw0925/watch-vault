import React from "react";
import {
  StatusDisplayMap,
  WatchlistItem,
  WatchStatus,
} from "@/types/watchlist";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const StatusBgColorMap = {
  [WatchStatus.PlanToWatch]: "dark:bg-amber-500/70 bg-amber-400/70",
  [WatchStatus.Watching]: "dark:bg-sky-500/70 bg-sky-400/70",
  [WatchStatus.FinishedWatching]: "dark:bg-emerald-500/70 bg-emerald-400/70",
} as const;

const WatchlistGridItem = ({
  watchlistItem,
}: {
  watchlistItem: WatchlistItem;
}) => {
  return <Content {...watchlistItem} />;
};

const Content = ({ anime, status, progress }: WatchlistItem) => (
  <motion.div whileHover={{ scale: 1.05 }}>
    <Link
      href={`/animes/${anime.id}`}
      className="flex flex-col gap-1 flex-shrink-0 items-center"
    >
      <div className="relative md:w-[216px] w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gray-800">
        <Image
          src={anime.images.webp.large_image_url}
          alt={anime.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        <div className="absolute flex items-center gap-1 top-1.5 left-1.5 text-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 py-2 px-2 bg-gray-900/40 rounded-xl">
          <Star fill="yellow" className="text-yellow-200 h-3 w-3" />
          <p className="text-sm">{anime.score.toFixed(2)}</p>
        </div>

        <div
          className={`absolute w-full text-center bottom-0 text-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 py-3 px-2 ${
            StatusBgColorMap[status ?? WatchStatus.PlanToWatch]
          }`}
        >
          <p className="text-center font-semibold">
            {StatusDisplayMap[status ?? WatchStatus.PlanToWatch]}
          </p>
        </div>
      </div>
      <div>
        <p className="text-center font-semibold line-clamp-3 md:line-clamp-none">
          {anime.title}
        </p>
        {anime.year > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {anime.year}
          </p>
        )}
        {status === WatchStatus.Watching && progress && (
          <p className="text-sm text-center">
            EP {progress}
            {anime.episodes && progress <= anime.episodes
              ? ` / ${anime.episodes} [${Math.floor(
                  (progress / anime.episodes) * 100
                )}%]`
              : ""}
          </p>
        )}
      </div>
    </Link>
  </motion.div>
);

export const ContentSkeleton = () =>
  [...Array(5)].map((_, i) => (
    <div key={i} className="flex flex-col gap-1 items-center">
      <Skeleton className="md:w-[216px] w-full aspect-[2/3] rounded-2xl" />
      <Skeleton className="w-[45%] h-5" />
    </div>
  ));

export default WatchlistGridItem;

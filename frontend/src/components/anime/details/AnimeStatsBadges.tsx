import { getRatingKey } from "@/lib/anime/rating/utils";
import { Anime, getQueryParam } from "@/types/anime";
import { Clapperboard, Star, Tv } from "lucide-react";
import Link from "next/link";
import React from "react";

const AnimeStatsBadges = ({ anime }: { anime: Anime }) => {
  const ratingTag =
    anime.rating !== "" ? (
      <p className="text-xs font-inter px-2 py-1 rounded-full border font-medium">
        {anime.rating}
      </p>
    ) : null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-1 py-1 px-2 rounded-full bg-secondary hover:bg-secondary/80">
        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        <p className="font-bold text-xs font-inter">{anime.score.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground font-inter">
          ({anime.scoredBy.toLocaleString()})
        </p>
      </div>

      <Link href={`/animes?type=${getQueryParam(anime.type)}`}>
        <div className="flex items-center gap-1 py-1 px-2 rounded-full bg-secondary hover:bg-secondary/80">
          {anime.type === "Movie" ? (
            <Clapperboard className="h-3 w-3" />
          ) : (
            <Tv className="h-3 w-3" />
          )}
          <p className="font-semibold text-xs font-inter">{anime.type}</p>
        </div>
      </Link>

      {getRatingKey(anime.rating) ? (
        <Link href={`/animes/rating/${getRatingKey(anime.rating)}`}>
          {ratingTag}
        </Link>
      ) : (
        ratingTag
      )}

      <p className="text-xs font-inter px-2 py-1 rounded-full border font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        {anime.status}
      </p>

      {anime.year > 0 && (
        <Link href={`/animes/seasons/${anime.year}/${anime.season}`}>
          <p className="text-xs font-inter px-2 py-1 rounded-full border font-medium capitalize">
            {`${anime.season} ${anime.year}`}
          </p>
        </Link>
      )}
    </div>
  );
};

export default AnimeStatsBadges;

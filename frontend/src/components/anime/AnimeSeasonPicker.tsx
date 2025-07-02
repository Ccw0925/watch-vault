import { toTitleCase } from "@/lib/strings/utils";
import { Season } from "@/types/anime";
import Link from "next/link";
import React from "react";

type Props = {
  selectedYear: number;
  selectedSeason: string;
  previousSeasons?: Season[];
  upcomingSeasons?: Season[];
};

const AnimeSeasonPicker = ({
  selectedYear,
  selectedSeason,
  previousSeasons = [],
  upcomingSeasons = [],
}: Props) => {
  const previousSeasonsCount = previousSeasons?.length ?? 0;
  const shouldDisplayUpcomingSeasonsCount = Math.min(
    upcomingSeasons?.length ?? 0,
    previousSeasonsCount - 2 >= 0 ? 1 : 1 + -1 * (previousSeasonsCount - 2)
  );
  const shouldDisplayPreviousSeasonsCount =
    3 - shouldDisplayUpcomingSeasonsCount;

  const renderSeasonLink = ({ season, year }: Season, isSelected = false) => (
    <div
      key={`${season}-${year}`}
      className={`md:py-4 py-1 flex-1 font-semibold md:text-base text-sm ${
        isSelected &&
        "md:font-extrabold font-bold dark:bg-gray-900 bg-gray-300 rounded-t-2xl"
      }`}
    >
      {isSelected ? (
        `${toTitleCase(season)} ${year}`
      ) : (
        <Link
          href={`/animes/seasons/${year}/${season}`}
          className="hover:underline underline-offset-2 cursor-pointer block"
        >
          {toTitleCase(season)} {year}
        </Link>
      )}
    </div>
  );

  return (
    <div className="flex items-center font-inter text-center gap-1">
      {previousSeasons
        .slice(0, shouldDisplayPreviousSeasonsCount)
        .reverse()
        .map((season) => renderSeasonLink(season))}

      {renderSeasonLink({ season: selectedSeason, year: selectedYear }, true)}

      {upcomingSeasons
        .slice(0, shouldDisplayUpcomingSeasonsCount)
        .map((season) => renderSeasonLink(season))}
    </div>
  );
};

export default AnimeSeasonPicker;

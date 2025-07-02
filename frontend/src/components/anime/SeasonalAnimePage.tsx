"use client";
import AnimeGridView, { AnimeSkeleton } from "@/components/anime/AnimeGridView";
import AnimeSeasonPicker from "@/components/anime/AnimeSeasonPicker";
import { SearchBar } from "@/components/anime/SearchBar";
import CustomPagination from "@/components/CustomPagination";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { useSeasonalAnimes } from "@/hooks/api/animeHooks";
import { getCurrentSeasonInJapan } from "@/lib/date/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const SeasonalAnimePage = () => {
  const { year, season } = useParams<{ year: string; season: string }>();

  const queryParams = useSearchParams();
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");

  const selectedYear = year ? parseInt(year) : new Date().getFullYear();
  const selectedSeason = season ?? getCurrentSeasonInJapan();

  const { data, isLoading } = useSeasonalAnimes({
    year: selectedYear,
    season: selectedSeason,
    page: pageInt,
  });
  const seasonalAnimes = data?.data;
  const totalPages = data?.pagination.last_visible_page;

  const previousSeasons = data?.previousSeasons;
  const upcomingSeasons = data?.upcomingSeasons;

  return (
    <div className="p-5 relative">
      <div className="absolute top-3 left-5 hidden sm:block h-[90px] w-[160px]">
        <Link href="/">
          <Image
            src="/logo-transparent.png"
            alt="Logo"
            width={160}
            height={90}
            priority
          />
        </Link>
      </div>

      <TypographyH1 className="text-center mb-5">Seasonal Animes</TypographyH1>

      <div className="flex flex-col items-center mb-5">
        <SearchBar />
      </div>

      {previousSeasons && upcomingSeasons && (
        <AnimeSeasonPicker
          selectedYear={selectedYear}
          selectedSeason={selectedSeason}
          upcomingSeasons={data?.upcomingSeasons}
          previousSeasons={data?.previousSeasons}
        />
      )}

      <div
        className={`dark:bg-gray-900 bg-gray-300 p-5 ${
          previousSeasons && previousSeasons.length > 0 && "rounded-tl-2xl"
        } ${upcomingSeasons && upcomingSeasons.length > 0 && "rounded-tr-2xl"}`}
      >
        <CustomPagination currentPage={pageInt} totalPages={totalPages} />

        {isLoading ? (
          <div className="grid grid-cols-[minmax(auto,700px)] lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
            <AnimeSkeleton />
          </div>
        ) : seasonalAnimes && seasonalAnimes.length > 0 ? (
          <div className="grid grid-cols-[minmax(auto,700px)] lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
            {seasonalAnimes.map(({ id, ...anime }) => (
              <AnimeGridView
                key={id}
                id={id}
                {...anime}
                gridContainerClassName="dark:md:bg-gray-950 md:bg-background"
              />
            ))}
          </div>
        ) : (
          <TypographyH3 className="text-muted-foreground text-center">
            No animes found
          </TypographyH3>
        )}

        {seasonalAnimes && seasonalAnimes.length > 0 && (
          <p className="font-inter text-center text-muted-foreground mb-5">
            Data provided by Jikan API.
          </p>
        )}

        <CustomPagination currentPage={pageInt} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default SeasonalAnimePage;

import CustomPagination from "@/components/CustomPagination";
import React from "react";
import AnimeGridView, { AnimeSkeleton } from "../AnimeGridView";
import { TypographyH3 } from "@/components/ui/typography";
import { AnimeTypeQueryParam } from "@/types/anime";
import { useSearchParams } from "next/navigation";
import { useTopAnimes } from "@/hooks/api/animeHooks";

const TopAnimeGridGroup = ({ type }: { type?: AnimeTypeQueryParam }) => {
  const queryParams = useSearchParams();
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");
  const allParams = Object.fromEntries(queryParams.entries());

  const { data, isLoading, isPlaceholderData } = useTopAnimes({
    page: pageInt,
    type: type,
  });
  const topAnimes = data?.data;
  const totalPages = data?.pagination.last_visible_page;

  return (
    <>
      {isLoading || isPlaceholderData ? (
        <div className="grid grid-cols-[minmax(auto,700px)] lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
          <AnimeSkeleton />
        </div>
      ) : topAnimes && topAnimes.length > 0 ? (
        <div className="grid grid-cols-[minmax(auto,700px)] lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
          {topAnimes.map(({ id, ...anime }) => (
            <AnimeGridView key={id} id={id} {...anime} />
          ))}
        </div>
      ) : (
        <TypographyH3 className="text-muted-foreground text-center">
          No animes found
        </TypographyH3>
      )}

      {topAnimes && topAnimes.length > 0 && (
        <p className="font-inter text-center text-muted-foreground mb-5">
          Data provided by Jikan API.
        </p>
      )}

      <CustomPagination
        currentPage={pageInt}
        totalPages={totalPages}
        additionalParams={allParams}
      />
    </>
  );
};

export default TopAnimeGridGroup;

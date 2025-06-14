import React from "react";
import AnimeGridView, { AnimeSkeleton } from "@/components/anime/AnimeGridView";
import CustomPagination from "@/components/CustomPagination";
import { TypographyH3 } from "@/components/ui/typography";
import { Anime } from "@/types/anime";

type Props = {
  animes?: Anime[];
  isLoading: boolean;
  pageInt: number;
  totalPages?: number;
};

const AnimeGridGroup = ({ animes, isLoading, pageInt, totalPages }: Props) => {
  return (
    <>
      <CustomPagination currentPage={pageInt} totalPages={totalPages} />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
          <AnimeSkeleton />
        </div>
      ) : animes && animes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
          {animes.map(({ id, ...anime }) => (
            <AnimeGridView key={id} id={id} {...anime} />
          ))}
        </div>
      ) : (
        <TypographyH3 className="text-muted-foreground text-center">
          No animes found
        </TypographyH3>
      )}

      {animes && animes.length > 0 && (
        <p className="font-inter text-center text-muted-foreground mb-5">
          Data provided by Jikan API.
        </p>
      )}

      <CustomPagination currentPage={pageInt} totalPages={totalPages} />
    </>
  );
};

export default AnimeGridGroup;

"use client";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import React, { Suspense } from "react";
import { useMovies } from "@/hooks/api/movieHooks";
import { Skeleton } from "@/components/ui/skeleton";
import MovieGridView from "@/components/movie/MovieGridView";
import { useSearchParams } from "next/navigation";
import CustomPagination from "@/components/CustomPagination";

const MoviesPage = () => {
  return (
    <Suspense>
      <MoviePageContent />
    </Suspense>
  );
};

const MoviePageContent = () => {
  const queryParams = useSearchParams();
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");
  const { data, isLoading } = useMovies({
    pageSize: 15,
    page: pageInt,
  });
  const movies = data?.data;
  const totalPages = data?.totalPages;

  const renderMovieSkeleton = () =>
    [...Array(5)].map((_, i) => (
      <div key={i} className="h-[350px] items-center py-5 flex flex-col gap-1">
        <Skeleton className="w-[215px] h-[254px] rounded-xl" />
        <Skeleton className="h-4 w-[50%]" />
        <Skeleton className="h-4 w-[30%]" />
      </div>
    ));

  const renderMovieView = () =>
    movies?.map(({ id, title, year, imagePath }) => (
      <MovieGridView
        key={id}
        id={id}
        title={title}
        year={year}
        imagePath={imagePath}
      />
    ));

  return (
    <div className="p-5">
      <TypographyH1 className="text-center mb-5">All Movies</TypographyH1>

      {movies && movies.length > 0 ? (
        <>
          <CustomPagination currentPage={pageInt} totalPages={totalPages} />

          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-[repeat(auto-fill,215px)] gap-5 justify-center">
              {isLoading ? renderMovieSkeleton() : renderMovieView()}
            </div>
          </div>

          <CustomPagination currentPage={pageInt} totalPages={totalPages} />
        </>
      ) : (
        <TypographyH3 className="text-muted-foreground text-center">
          No movies available.
        </TypographyH3>
      )}
    </div>
  );
};

export default MoviesPage;

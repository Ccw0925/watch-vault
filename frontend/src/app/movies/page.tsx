"use client";
import { TypographyH1 } from "@/components/ui/typography";
import React from "react";
import { useMovies } from "@/hooks/api/movieHooks";
import { Skeleton } from "@/components/ui/skeleton";
import MovieGridView from "@/components/movie/MovieGridView";
import { useSearchParams } from "next/navigation";

const MoviesPage = () => {
  const queryParams = useSearchParams();
  const page = queryParams.get("page");
  const { data, isLoading } = useMovies({
    pageSize: 20,
    page: parseInt(page ?? "1"),
  });
  const movies = data?.data;

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

      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-[repeat(auto-fill,215px)] gap-5 justify-center">
          {isLoading ? renderMovieSkeleton() : renderMovieView()}
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;

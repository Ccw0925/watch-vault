import React from "react";
import { TypographyH3 } from "../ui/typography";
import Image from "next/image";
import { useMovies } from "@/hooks/api/movieHooks";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";

const ContinueWatching = () => {
  const { data: movies, isLoading } = useMovies({ pageSize: 15 });

  const renderMovieSkeleton = () =>
    [...Array(8)].map((_, i) => (
      <div key={i} className="h-[350px] items-center py-5 flex flex-col gap-1">
        <Skeleton className="w-[215px] h-[254px] rounded-xl" />
        <Skeleton className="h-4 w-[50%]" />
        <Skeleton className="h-4 w-[30%]" />
      </div>
    ));

  const renderMovieView = () =>
    movies?.map(({ id, title, year, imagePath }) => (
      <div key={id} className="h-[350px] items-center py-5 flex flex-col gap-1">
        <div className="w-[215px] rounded-xl flex-1 dark:bg-[#22262c] bg-gray-300 relative">
          <Link href={`/movies/${id}`}>
            <Image
              src={
                imagePath
                  ? `http://localhost:8080/${imagePath}`
                  : "/placeholder.png"
              }
              alt="Description of your image"
              fill
              sizes="215px"
              className={`rounded-xl ${
                imagePath ? "object-cover" : "object-contain"
              }`}
            />
          </Link>
        </div>

        <div>
          <Link href={`/movies/${id}`}>
            <p className="font-inter">{title}</p>
          </Link>
        </div>

        <div>
          <Link href={`/movies/${id}`}>
            <p className="font-inter text-muted-foreground">{year}</p>
          </Link>
        </div>
      </div>
    ));

  return (
    <div>
      <TypographyH3 className="mb-5">Continue Watching</TypographyH3>

      <div className="flex gap-5 overflow-x-auto scrollbar-hover">
        {isLoading ? renderMovieSkeleton() : renderMovieView()}
      </div>

      <div className="flex justify-center">
        <Link href="/movies">
          <Button className="cursor-pointer dark:bg-[#22262c] text-white">
            See all
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ContinueWatching;

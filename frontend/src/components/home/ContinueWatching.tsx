import React from "react";
import { TypographyH3 } from "../ui/typography";
import { useMovies } from "@/hooks/api/movieHooks";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "motion/react";
import MovieGridView from "../movie/MovieGridView";

const ContinueWatching = () => {
  const { data, isLoading } = useMovies({ pageSize: 15 });
  const movies = data?.data;

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
      <MovieGridView
        key={id}
        id={id}
        title={title}
        year={year}
        imagePath={imagePath}
      />
    ));

  return (
    <div>
      <TypographyH3>Continue Watching</TypographyH3>

      <div className="flex gap-5 overflow-x-auto scrollbar-hover">
        {isLoading ? renderMovieSkeleton() : renderMovieView()}
      </div>

      <motion.div whileTap={{ y: -1 }} className="flex justify-center">
        <Link href="/movies">
          <Button className="cursor-pointer dark:bg-[#22262c] text-white">
            See all
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ContinueWatching;

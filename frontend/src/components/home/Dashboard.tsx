import { useMovies } from "@/hooks/api/movieHooks";
import React from "react";
import HighlightsBanner from "./HighlightsBanner";
import {
  TypographyH1,
  TypographyH4,
  TypographyP,
} from "@/components/ui/typography";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const Dashboard = ({ className }: { className?: string }) => {
  const { data: movies, isLoading, isError, error } = useMovies();

  if (isLoading) {
    return <div>Loading movies...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch movies"}</div>;
  }

  return (
    <div className={twMerge("p-5 overflow-y-auto", className)}>
      <HighlightsBanner />

      <div className="relative flex justify-center mb-4 mt-5">
        <TypographyH1 className="text-2xl font-bold text-center">
          My Movie Watchlist
        </TypographyH1>

        <div className="absolute right-0 h-full flex items-center">
          <Link href={"/movies/new"}>
            <Button className="text-white cursor-pointer font-inter">
              New
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-y-3 gap-x-5 justify-center">
        {movies && movies.length > 0 ? (
          movies.map(({ id, title, year, watched, imagePath }) => (
            <Link key={id} href={`/movies/${id}`}>
              <motion.div
                className="h-[250px] rounded-xl flex flex-1 max-w-[400px] min-w-[350px] shadow-lg hover:shadow-xl hover:cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`flex-1 rounded-l-xl flex ${
                    imagePath ? "bg-black" : "bg-white"
                  }`}
                >
                  <Image
                    src={
                      imagePath
                        ? `http://localhost:8080/${imagePath}`
                        : "/placeholder.png"
                    }
                    width={200}
                    height={200}
                    alt="Picture of the movie"
                    className={`rounded-l-xl object-contain`}
                  />
                </div>
                <div className="dark:bg-gray-800 bg-gray-300 flex-1 rounded-r-xl p-5">
                  <TypographyH4 className="dark:text-white">{title}</TypographyH4>
                  <p className="dark:text-white font-inter">{year}</p>
                  <p className="dark:text-white font-inter">
                    Status: {watched ? "✅ Watched" : "⏳ Not Watched"}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <TypographyP>No movies found</TypographyP>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

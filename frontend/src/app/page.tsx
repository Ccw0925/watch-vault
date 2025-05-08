"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ThemeButton from "@/components/ThemeButton";
import {
  TypographyH1,
  TypographyH4,
  TypographyP,
} from "@/components/ui/typography";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";

const fetchMovies = async (): Promise<Movie[]> => {
  const response = await axios.get<Movie[]>("/api/movies");
  return response.data;
};

export default function Home() {
  const {
    data: movies,
    isLoading,
    isError,
    error,
  } = useQuery<Movie[], Error>({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  if (isLoading) {
    return <div>Loading movies...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch movies"}</div>;
  }

  return (
    <div className="p-5">
      <div className="flex justify-end mb-2">
        <ThemeButton />
      </div>
      <div className="relative flex justify-center mb-4">
        <TypographyH1 className="text-2xl font-bold text-center">
          My Movie Watchlist
        </TypographyH1>
        <div className="absolute right-0 h-full flex items-center">
          <Link href={"/movies/new"}>
            <Button className="text-white cursor-pointer">New</Button>
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
                    alt="Picture of the author"
                    className={`rounded-l-xl ${
                      imagePath ? "object-cover" : "object-contain"
                    }`}
                  />
                </div>
                <div className="bg-gray-800 flex-1 rounded-r-xl p-5">
                  <TypographyH4 className="text-white">{title}</TypographyH4>
                  <p className="text-white">{year}</p>
                  <p className="text-white">
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
}

"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ThemeButton from "@/components/ThemeButton";

// Define TypeScript interface for Movie
interface Movie {
  id: number;
  title: string;
  year: number;
  watched: boolean;
}

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
    <div className="max-w-4xl mx-auto p-5">
      <ThemeButton />
      <h1 className="text-2xl font-bold mb-4">My Movie Watchlist</h1>
      <ul className="list-none p-0">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <li key={movie.id} className="bg-gray-100 p-4 mb-3 rounded-md">
              <h2 className="text-xl font-semibold mt-0 text-black">
                {movie.title} ({movie.year})
              </h2>
              <p className="text-black">
                Status: {movie.watched ? "✅ Watched" : "⏳ Not Watched"}
              </p>
            </li>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </ul>
    </div>
  );
}

"use client";

import { Movie } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { TypographyP } from "../ui/typography";
import Image from "next/image";

const fetchMovieDetails = async (id: string): Promise<Movie> => {
  const response = await axios.get<Movie>(`/api/movies/${id}`);
  return response.data;
};

const MovieDetails = ({ id }: { id: string }) => {
  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery<Movie, Error>({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetails(id),
  });

  if (isLoading) {
    return <div>Loading movie details...</div>;
  }

  if (isError) {
    return (
      <div>Error: {error?.message || "Failed to fetch movie details"}</div>
    );
  }

  return (
    <>
      {movie && (
        <div className="mt-5 flex gap-x-5">
          <div className="rounded-lg">
            <Image
              src={
                movie.imagePath
                  ? `http://localhost:8080/${movie.imagePath}`
                  : "/placeholder.png"
              }
              alt="Picture of the movie"
              width={300}
              height={450}
              className="rounded-lg"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div>
            <TypographyP>
              <span className="font-bold">Title:</span> {movie.title}
            </TypographyP>
            <TypographyP>
              <span className="font-bold">Year:</span> {movie.year}
            </TypographyP>
            <TypographyP>
              <span className="font-bold">Watched:</span>{" "}
              {movie.watched ? "✅ Watched" : "⏳ Not Watched"}
            </TypographyP>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetails;

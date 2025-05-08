import MovieDetails from "@/components/movie/MovieDetails";
import { TypographyH2 } from "@/components/ui/typography";
import React from "react";

const MovieDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="p-5">
      <TypographyH2>Movie: {id}</TypographyH2>
      <MovieDetails id={id} />
    </div>
  );
};

export default MovieDetailsPage;

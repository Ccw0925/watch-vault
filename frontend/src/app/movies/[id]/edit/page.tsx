import MovieForm from "@/components/movie/MovieForm";
import { TypographyH2 } from "@/components/ui/typography";
import React from "react";

const MovieEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <div className="p-5">
      <TypographyH2>Movie: {id}</TypographyH2>
      <MovieForm id={id} />
    </div>
  );
};

export default MovieEditPage;

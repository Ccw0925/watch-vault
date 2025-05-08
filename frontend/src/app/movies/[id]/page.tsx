import MovieDetails from "@/components/movie/MovieDetails";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography";
import Link from "next/link";
import React from "react";

const MovieDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="p-5">
      <div className="relative flex">
        <TypographyH2 className="flex-1">Movie: {id}</TypographyH2>
        <div className="absolute right-0 h-full flex">
          <Link href={`/movies/${id}/edit`}>
          <Button className="text-white cursor-pointer">Edit</Button>
          </Link>
        </div>
      </div>
      <MovieDetails id={id} />
    </div>
  );
};

export default MovieDetailsPage;

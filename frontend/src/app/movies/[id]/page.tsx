import MovieDetails from "@/components/movie/MovieDetails";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography";
import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

const MovieDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="p-5">
      <div className="relative flex items-center">
        <TypographyH2 className="flex-1 flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          Movie: {id}
        </TypographyH2>
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

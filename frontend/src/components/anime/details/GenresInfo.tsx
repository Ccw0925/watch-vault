import { Button } from "@/components/ui/button";
import { Anime } from "@/types/anime";
import { Tag } from "lucide-react";
import Link from "next/link";
import React from "react";

const GenresInfo = ({ genres }: Pick<Anime, "genres">) => {
  return (
    genres.length > 0 && (
      <div>
        <div className="flex gap-1 items-center mb-3">
          <h3 className="font-semibold font-inter">Genres</h3>
          <Tag className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map(({ name, mal_id }) => (
            <Link key={mal_id} href={`/animes/genre/${mal_id}?name=${name}`}>
              <Button className="cursor-pointer rounded-3xl font-inter text-xs text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 hover:shadow-md">
                {name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default GenresInfo;

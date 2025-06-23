import { Calendar } from "lucide-react";
import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  id: number;
  title: string;
  aired: string;
  filler: boolean;
};

const AnimeEpisodeCard = ({ id, title, aired, filler }: Props) => {
  return (
    <div className="border font-inter p-4 rounded-lg grid grid-rows-subgrid row-span-3 shadow-sm">
      <div className="flex justify-between">
        <p className="border px-2 rounded-full font-semibold text-sm">
          EP {id}
        </p>
        {filler && (
          <p className="border px-2 rounded-full text-sm bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 font-semibold">
            Filler
          </p>
        )}
      </div>
      <p className="font-bold text-sm">{title}</p>
      <div className="flex items-center gap-1 text-muted-foreground text-xs">
        <Calendar className="h-3 w-3" />
        <p>
          {new Date(aired).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export const EpisodesSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="border font-inter p-4 rounded-lg grid grid-rows-subgrid row-span-3"
      >
        <div className="flex">
          <Skeleton className="h-6 w-13" />
        </div>
        <Skeleton className="h-4 w-[65%]" />
        <Skeleton className="h-4 w-[30%]" />
      </div>
    ))}
  </div>
);

export default AnimeEpisodeCard;

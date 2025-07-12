import { Button } from "@/components/ui/button";
import { Anime } from "@/types/anime";
import { Users } from "lucide-react";
import Link from "next/link";
import React from "react";

const DemographicsInfo = ({ demographics }: Pick<Anime, "demographics">) => {
  return (
    demographics.length > 0 && (
      <div>
        <div className="flex gap-1 items-center mb-3">
          <h3 className="font-semibold font-inter">Demographics</h3>
          <Users className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {demographics.map(({ name, mal_id }) => (
            <Link key={mal_id} href={`/animes/genre/${mal_id}?name=${name}`}>
              <Button className="cursor-pointer rounded-3xl font-inter text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 hover:shadow-md">
                {name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default DemographicsInfo;

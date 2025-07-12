import { Button } from "@/components/ui/button";
import { Anime } from "@/types/anime";
import Link from "next/link";
import React from "react";

const ProducersInfo = ({ producers }: Pick<Anime, "producers">) => {
  return (
    producers.length > 0 && (
      <div>
        <h3 className="font-semibold mb-3 font-inter">Producers</h3>
        <div className="flex flex-wrap gap-2">
          {producers.map(({ name, mal_id, url }) => (
            <Link key={mal_id} href={url}>
              <Button
                variant="outline"
                className="cursor-pointer rounded-3xl font-inter"
              >
                {name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default ProducersInfo;

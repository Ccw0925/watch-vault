import { Anime } from '@/types/anime';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { twMerge } from 'tailwind-merge';

const AnimePrequelSequelGroup = ({
  relations,
  classname,
}: Pick<Anime, "relations"> & { classname?: string }) => {
  const router = useRouter();

  const prequel = relations?.find(
    (relation) => relation.relation === "Prequel"
  );
  const sequel = relations?.find((relation) => relation.relation === "Sequel");

  return (
    (prequel || sequel) && (
      <div
        className={twMerge(
          "gap-x-5 grid-cols-2 grid-rows-[auto_1fr]",
          classname
        )}
      >
        {prequel && (
          <div
            onClick={() =>
              router.replace(
                `/animes/${prequel.entry[0].mal_id}?name=${encodeURIComponent(
                  prequel.entry[0].name
                )}`
              )
            }
            className={`group items-center gap-x-2 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md font-inter hover:bg-card px-4 py-2 cursor-pointer row-span-2 grid grid-rows-subgrid grid-cols-[auto_1fr] ${
              !sequel && "col-span-2"
            }`}
          >
            <div className="row-span-2">
              <ChevronLeft />
            </div>
            <div className="grid grid-rows-subgrid row-span-2 items-center">
              <p className="font-inter text-muted-foreground text-sm">
                Prequel
              </p>
              <p className="font-inter group-hover:underline md:text-base text-sm truncate">
                {prequel.entry[0].name}
              </p>
            </div>
          </div>
        )}
        {sequel && (
          <div
            onClick={() =>
              router.replace(
                `/animes/${sequel.entry[0].mal_id}?name=${encodeURIComponent(
                  sequel.entry[0].name
                )}`
              )
            }
            className={`flex-1 group justify-end items-center gap-x-2 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md font-inter px-4 py-2 cursor-pointer row-span-2 grid grid-rows-subgrid grid-cols-[1fr_auto] ${
              !prequel && "col-span-2"
            }`}
          >
            <div className="grid grid-rows-subgrid row-span-2 items-center">
              <p className="font-inter text-muted-foreground text-sm text-right">
                Sequel
              </p>
              <p className="font-inter text-right group-hover:underline md:text-base text-sm truncate">
                {sequel.entry[0].name}
              </p>
            </div>
            <div className="row-span-2">
              <ChevronRight />
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default AnimePrequelSequelGroup
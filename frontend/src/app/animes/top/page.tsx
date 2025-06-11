"use client";
import AnimeGridView from "@/components/anime/AnimeGridView";
import CustomPagination from "@/components/CustomPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { useTopAnimes } from "@/hooks/api/animeHooks";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const TopAnimePage = () => {
  const queryParams = useSearchParams();
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");
  const { data, isLoading } = useTopAnimes({ page: pageInt });
  const topAnimes = data?.data;
  const totalPages = data?.pagination.last_visible_page;

  return (
    <div className="p-5 relative">
      <div className="absolute top-3 left-5 hidden sm:block h-[90px] w-[160px]">
        <Link href="/">
          <Image
            src="/logo-transparent.png"
            alt="Logo"
            width={160}
            height={90}
            priority
          />
        </Link>
      </div>

      <TypographyH1 className="text-center mb-5">Top Animes</TypographyH1>

      <CustomPagination currentPage={pageInt} totalPages={totalPages} />

      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
          <AnimeSkeleton />
        </div>
      ) : topAnimes && topAnimes.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
          {topAnimes.map(({ id, ...anime }) => (
            <AnimeGridView key={id} id={id} {...anime} />
          ))}
        </div>
      ) : (
        <TypographyH3 className="text-muted-foreground text-center">
          No animes found
        </TypographyH3>
      )}

      {topAnimes && topAnimes.length > 0 && (
        <p className="font-inter text-center text-muted-foreground mb-5">
          Data provided by Jikan API.
        </p>
      )}

      <CustomPagination currentPage={pageInt} totalPages={totalPages} />
    </div>
  );
};

const AnimeSkeleton = () =>
  [...Array(5)].map((_, i) => (
    <div
      key={i}
      className="h-[350px] w-[550px] border rounded-2xl flex p-3 gap-4"
    >
      <div className="flex-4 rounded-2xl">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex-5 flex flex-col gap-5">
        <Skeleton className="h-12 w-[50%]" />
        <Skeleton className="h-6 w-[35%]" />
        <Skeleton className="h-8 w-[80%] my-2" />
      </div>
    </div>
  ));

export default TopAnimePage;

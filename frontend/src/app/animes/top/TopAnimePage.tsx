"use client";
import AnimeGridView, { AnimeSkeleton } from "@/components/anime/AnimeGridView";
import CustomPagination from "@/components/CustomPagination";
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
        <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
          <AnimeSkeleton />
        </div>
      ) : topAnimes && topAnimes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 my-5">
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

export default TopAnimePage;

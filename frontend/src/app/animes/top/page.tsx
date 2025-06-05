"use client";
import AnimeGridView from "@/components/anime/AnimeGridView";
import CustomPagination from "@/components/CustomPagination";
import { TypographyH1 } from "@/components/ui/typography";
import { useTopAnimes } from "@/hooks/api/animeHooks";
import { useSearchParams } from "next/navigation";
import React from "react";

const TopAnimePage = () => {
  const queryParams = useSearchParams();
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");
  const { data, isLoading } = useTopAnimes({ page: pageInt });
  const topAnimes = data?.data;
  const totalPages = data?.pagination.last_visible_page;

  if (isLoading) <div>Loading...</div>;

  return (
    <div className="p-5">
      <TypographyH1 className="text-center mb-5">Top Animes</TypographyH1>

      <CustomPagination currentPage={pageInt} totalPages={totalPages} />

      <div className="grid grid-cols-[repeat(auto-fill,550px)] justify-center my-5 gap-5">
        {topAnimes?.map(({ id, ...anime }) => (
          <AnimeGridView key={id} {...anime} />
        ))}
      </div>

      <CustomPagination currentPage={pageInt} totalPages={totalPages} />
    </div>
  );
};

export default TopAnimePage;

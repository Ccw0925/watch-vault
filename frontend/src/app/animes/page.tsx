"use client";
import AnimeGridGroup from "@/components/anime/AnimeGridGroup";
import { TypographyH1 } from "@/components/ui/typography";
import { useAnimes } from "@/hooks/api/animeHooks";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const AllAnimesPage = () => {
  const queryParams = useSearchParams();
  const rating = queryParams.get("rating");
  const genres = queryParams.get("genres");
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");

  const [sort, setSort] = useState(queryParams.get("sort") ?? "desc");
  const [orderBy, setOrderBy] = useState(
    queryParams.get("orderBy") ?? "members"
  );

  const { data, isLoading, isPlaceholderData } = useAnimes({
    rating,
    genres,
    page: pageInt,
    orderBy,
    sort,
  });
  const animes = data?.data;
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

      <TypographyH1 className="text-center mb-5">All Animes</TypographyH1>

      <AnimeGridGroup
        animes={animes}
        isLoading={isLoading || isPlaceholderData}
        pageInt={pageInt}
        totalPages={totalPages}
        orderBy={orderBy}
        sort={sort}
        setOrderBy={setOrderBy}
        setSort={setSort}
      />
    </div>
  );
};

export default AllAnimesPage;

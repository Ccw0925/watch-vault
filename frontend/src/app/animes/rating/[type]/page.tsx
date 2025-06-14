"use client";
import AnimeGridGroup from "@/components/anime/AnimeGridGroup";
import { TypographyH1 } from "@/components/ui/typography";
import { useAnimes } from "@/hooks/api/animeHooks";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const AnimeByRatingPage = () => {
  const { type } = useParams<{ type: string }>();
  const queryParams = useSearchParams();
  const ratingName = queryParams.get("name");
  const genres = queryParams.get("genres");
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");

  const [sort, setSort] = useState(queryParams.get("sort") ?? "asc");
  const [orderBy, setOrderBy] = useState(
    queryParams.get("orderBy") ?? "popularity"
  );

  const { data, isLoading, isPlaceholderData } = useAnimes({
    rating: type,
    page: pageInt,
    orderBy,
    sort,
    genres,
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

      <TypographyH1 className="text-center mb-5">{`${
        ratingName ?? "Rating Group"
      } Animes`}</TypographyH1>

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

export default AnimeByRatingPage;

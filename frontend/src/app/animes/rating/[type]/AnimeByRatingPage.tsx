"use client";
import AnimeGridGroup from "@/components/anime/AnimeGridGroup";
import { SearchBar } from "@/components/anime/SearchBar";
import { TypographyH1 } from "@/components/ui/typography";
import { useAnimes } from "@/hooks/api/animeHooks";
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
      <TypographyH1 className="text-center mb-5">{`${
        ratingName ?? "Rating Group"
      } Animes`}</TypographyH1>

      <div className="flex flex-col items-center mb-5">
        <SearchBar />
      </div>

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

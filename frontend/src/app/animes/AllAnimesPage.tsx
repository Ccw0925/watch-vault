"use client";
import AnimeGridGroup from "@/components/anime/AnimeGridGroup";
import { SearchBar } from "@/components/anime/SearchBar";
import { useAnimes } from "@/hooks/api/animeHooks";
import { AnimeTypeQueryParam } from "@/types/anime";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const AllAnimesPage = () => {
  const queryParams = useSearchParams();
  const rating = queryParams.get("rating");
  const animeType = queryParams.get("type");
  const genres = queryParams.get("genres");
  const queryString = queryParams.get("q");
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");

  const [sort, setSort] = useState(queryParams.get("sort") ?? "desc");
  const [orderBy, setOrderBy] = useState(
    queryParams.get("orderBy") ?? "members"
  );

  const { data, isLoading, isPlaceholderData } = useAnimes({
    rating,
    type: animeType ? (animeType as AnimeTypeQueryParam) : undefined,
    genres,
    page: pageInt,
    orderBy,
    sort,
    queryString,
  });
  const animes = data?.data;
  const totalPages = data?.pagination.last_visible_page;

  return (
    <div className="p-5 relative">
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

export default AllAnimesPage;

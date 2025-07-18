"use client";
import AnimeGridGroup from "@/components/anime/AnimeGridGroup";
import { SearchBar } from "@/components/anime/SearchBar";
import { TypographyH1 } from "@/components/ui/typography";
import { useAnimes } from "@/hooks/api/animeHooks";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const AnimeByGenrePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryParams = useSearchParams();
  const genreName = queryParams.get("name");
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");
  const rating = queryParams.get("rating");

  const [sort, setSort] = useState(queryParams.get("sort") ?? "asc");
  const [orderBy, setOrderBy] = useState(
    queryParams.get("orderBy") ?? "popularity"
  );

  const { data, isLoading } = useAnimes({
    genres: id,
    page: pageInt,
    rating,
    orderBy,
    sort,
  });
  const animes = data?.data;
  const totalPages = data?.pagination.last_visible_page;

  return (
    <div className="p-5 relative">
      <TypographyH1 className="text-center mb-5">{`${
        genreName ?? "Genre"
      } Animes`}</TypographyH1>

      <div className="flex flex-col items-center mb-5">
        <SearchBar />
      </div>

      <AnimeGridGroup
        animes={animes}
        isLoading={isLoading}
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

export default AnimeByGenrePage;

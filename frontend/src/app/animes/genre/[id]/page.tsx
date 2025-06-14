"use client";
import AnimeGridGroup from "@/components/anime/AnimeGridGroup";
import { TypographyH1 } from "@/components/ui/typography";
import { useAnimes } from "@/hooks/api/animeHooks";
import Image from "next/image";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const AnimeByGenrePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryParams = useSearchParams();
  const genreName = queryParams.get("name");
  const page = queryParams.get("page");
  const pageInt = parseInt(page ?? "1");
  const rating = queryParams.get("rating");

  const { data, isLoading } = useAnimes({ genres: id, page: pageInt, rating });
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
        genreName ?? "Genre"
      } Animes`}</TypographyH1>

      <AnimeGridGroup
        animes={animes}
        isLoading={isLoading}
        pageInt={pageInt}
        totalPages={totalPages}
      />
    </div>
  );
};

export default AnimeByGenrePage;

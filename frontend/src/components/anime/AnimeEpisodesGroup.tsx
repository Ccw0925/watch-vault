"use client";
import { List } from "lucide-react";
import React, { useState } from "react";
import { TypographyH3 } from "../ui/typography";
import AnimeEpisodeCard, { EpisodesSkeleton } from "./AnimeEpisodeCard";
import { useAnimeEpisodes } from "@/hooks/api/animeHooks";
import CustomPagination from "../CustomPagination";

const AnimeEpisodesGroup = ({ id }: { id: string }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isPlaceholderData } = useAnimeEpisodes({ id, page });
  const episodes = data?.data;
  const totalPages = data?.pagination.last_visible_page;

  return (
    <div>
      <div className="flex gap-2 items-center mb-5">
        <List />
        <TypographyH3>Episodes</TypographyH3>
      </div>

      {isLoading || isPlaceholderData ? (
        <EpisodesSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          {episodes?.map(({ mal_id, title, aired, filler }) => (
            <AnimeEpisodeCard
              key={mal_id}
              id={mal_id}
              title={title}
              aired={aired}
              filler={filler}
            />
          ))}
        </div>
      )}

      {totalPages && totalPages > 1 && (
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          setPage={setPage}
          useRouter={false}
        />
      )}
    </div>
  );
};

export default AnimeEpisodesGroup;

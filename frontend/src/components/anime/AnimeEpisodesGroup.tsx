"use client";
import { List } from "lucide-react";
import React, { useState, useMemo } from "react";
import { TypographyH3, TypographyMuted } from "../ui/typography";
import AnimeEpisodeCard, { EpisodesSkeleton } from "./AnimeEpisodeCard";
import { useAnimeEpisodes } from "@/hooks/api/animeHooks";
import CustomPagination from "../CustomPagination";

const EPISODES_PER_PAGE = 20;
const API_EPISODES_PER_PAGE = 100; // Based on Jikan API response

const AnimeEpisodesGroup = ({ id }: { id: string }) => {
  const [page, setPage] = useState(1);
  const apiPagesPerClientPage = Math.ceil(
    API_EPISODES_PER_PAGE / EPISODES_PER_PAGE
  );
  const { data, isLoading, isPlaceholderData } = useAnimeEpisodes({
    id,
    page: Math.ceil(page / 5),
  });
  const episodes = data?.data;
  const totalEpisodes = data?.totalCount;

  const displayedEpisodes = useMemo(() => {
    if (!episodes) return [];
    const startIndex = ((page - 1) * EPISODES_PER_PAGE) % API_EPISODES_PER_PAGE;
    return episodes.slice(startIndex, EPISODES_PER_PAGE + startIndex);
  }, [episodes, page]);

  const calculateTotalPage = () => {
    const apiTotalPages = data?.pagination.last_visible_page || 1;

    if (totalEpisodes) return Math.ceil(totalEpisodes / EPISODES_PER_PAGE);

    if (episodes && apiTotalPages === 1)
      return Math.ceil(episodes?.length / EPISODES_PER_PAGE);

    return Math.ceil(apiTotalPages * apiPagesPerClientPage);
  };

  const totalPages = calculateTotalPage();

  return (
    <div>
      <div className="flex gap-2 items-center mb-5 mt-2">
        <List />
        <TypographyH3>Episodes</TypographyH3>
      </div>

      {isLoading || isPlaceholderData ? (
        <EpisodesSkeleton />
      ) : (
        <>
          {episodes && episodes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
              {displayedEpisodes?.map(({ mal_id, title, aired, filler }) => (
                <AnimeEpisodeCard
                  key={mal_id}
                  id={mal_id}
                  title={title}
                  aired={aired}
                  filler={filler}
                />
              ))}
            </div>
          ) : (
            <TypographyMuted>No episodes found.</TypographyMuted>
          )}
        </>
      )}

      {episodes && episodes.length > 0 && totalPages && totalPages > 1 && (
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

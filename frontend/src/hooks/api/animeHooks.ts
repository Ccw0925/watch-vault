import {
  fetchAnimeById,
  fetchAnimeCharactersById,
  fetchAnimeEpisodes,
  fetchAnimes,
  fetchTopAnimes,
} from "@/lib/api/animeService";
import {
  Anime,
  AnimeCharacter,
  AnimesResponse,
  EpisodesResponse,
} from "@/types/anime";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useAnimes = ({
  page,
  genres,
  rating,
  orderBy,
  sort,
  queryString,
}: {
  page?: number;
  genres?: string | null;
  rating?: string | null;
  orderBy?: string | null;
  sort?: string | null;
  queryString?: string | null;
}) => {
  return useQuery<AnimesResponse, Error>({
    queryKey: ["animes", { page, genres, rating, orderBy, sort, queryString }],
    queryFn: () =>
      fetchAnimes({ page, genres, rating, orderBy, sort, queryString }),
    placeholderData: keepPreviousData,
  });
};

export const useAnimeById = (id: string) => {
  return useQuery<Anime, Error>({
    queryKey: ["animes", id],
    queryFn: () => fetchAnimeById(id),
  });
};

export const useTopAnimes = ({ page }: { page?: number }) => {
  return useQuery<AnimesResponse, Error>({
    queryKey: ["animes", { page }],
    queryFn: () => fetchTopAnimes({ page }),
    placeholderData: keepPreviousData,
  });
};

export const useAnimeEpisodes = ({
  id,
  page,
}: {
  id: string;
  page?: number;
}) => {
  return useQuery<EpisodesResponse, Error>({
    queryKey: ["animeEpisodes", { id, page }],
    queryFn: () => fetchAnimeEpisodes(id, { page }),
    placeholderData: keepPreviousData,
  });
};

export const useAnimeCharacters = (id: string) => {
  return useQuery<AnimeCharacter[], Error>({
    queryKey: ["animeCharacters", id],
    queryFn: () => fetchAnimeCharactersById(id),
  });
};

import {
  fetchAnimeById,
  fetchAnimeCharactersById,
  fetchAnimeEpisodes,
  fetchAnimes,
  fetchDeveloperRecommendations,
  fetchSeasonalAnimes,
  fetchTopAnimes,
  fetchUpcomingAnimes,
} from "@/lib/api/animeService";
import {
  Anime,
  AnimeCharacter,
  AnimesResponse,
  EpisodesResponse,
  SeasonalAnimesResponse,
} from "@/types/anime";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useAnimes = ({
  page,
  limit,
  genres,
  rating,
  orderBy,
  sort,
  queryString,
}: {
  page?: number;
  limit?: number;
  genres?: string | null;
  rating?: string | null;
  orderBy?: string | null;
  sort?: string | null;
  queryString?: string | null;
}) => {
  return useQuery<AnimesResponse, Error>({
    queryKey: [
      "animes",
      { page, limit, genres, rating, orderBy, sort, queryString },
    ],
    queryFn: () =>
      fetchAnimes({ page, limit, genres, rating, orderBy, sort, queryString }),
    placeholderData: keepPreviousData,
  });
};

export const useAnimeById = (id: string) => {
  return useQuery<Anime, Error>({
    queryKey: ["animes", id],
    queryFn: () => fetchAnimeById(id),
  });
};

export const useTopAnimes = ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery<AnimesResponse, Error>({
    queryKey: ["topAnimes", { page, limit }],
    queryFn: () => fetchTopAnimes({ page, limit }),
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

export const useUpcomingAnimes = ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery<AnimesResponse, Error>({
    queryKey: ["upcomingAnimes", { page, limit }],
    queryFn: () => fetchUpcomingAnimes({ page, limit }),
    placeholderData: keepPreviousData,
  });
};

export const useSeasonalAnimes = ({
  year,
  season,
  page,
}: {
  year: number;
  season: string;
  page?: number;
}) => {
  return useQuery<SeasonalAnimesResponse, Error>({
    queryKey: ["seasonalAnimes", { year, season, page }],
    queryFn: () => fetchSeasonalAnimes(year, season, { page }),
    placeholderData: keepPreviousData,
  });
};

export const useDeveloperRecomendations = () => {
  return useQuery<Anime[], Error>({
    queryKey: ["developerRecomendations"],
    queryFn: () => fetchDeveloperRecommendations(),
  });
};

import {
  fetchAnimeById,
  fetchAnimes,
  fetchTopAnimes,
} from "@/lib/api/animeService";
import { Anime, AnimesResponse } from "@/types/anime";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useAnimes = ({
  page,
  genres,
  rating,
  orderBy,
  sort,
}: {
  page?: number;
  genres?: string | null;
  rating?: string | null;
  orderBy?: string | null;
  sort?: string | null;
}) => {
  return useQuery<AnimesResponse, Error>({
    queryKey: ["animes", { page, genres, rating, orderBy, sort }],
    queryFn: () => fetchAnimes({ page, genres, rating, orderBy, sort }),
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

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
}: {
  page?: number;
  genres?: string;
  rating?: string;
}) => {
  return useQuery<AnimesResponse, Error>({
    queryKey: ["animes", { page, genres, rating }],
    queryFn: () => fetchAnimes({ page, genres, rating }),
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

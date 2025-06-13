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
}: {
  page?: number;
  genres?: string;
}) => {
  return useQuery<AnimesResponse, Error>({
    queryKey: ["animes", { page, genres }],
    queryFn: () => fetchAnimes({ page, genres }),
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

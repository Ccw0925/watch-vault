import { fetchAnimeById, fetchTopAnimes } from "@/lib/api/animeService";
import { Anime, TopAnimesResponse } from "@/types/anime";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useAnimeById = (id: string) => {
  return useQuery<Anime, Error>({
    queryKey: ["animes", id],
    queryFn: () => fetchAnimeById(id),
  });
};

export const useTopAnimes = ({ page }: { page?: number }) => {
  return useQuery<TopAnimesResponse, Error>({
    queryKey: ["animes", { page }],
    queryFn: () => fetchTopAnimes({ page }),
    placeholderData: keepPreviousData,
  });
};

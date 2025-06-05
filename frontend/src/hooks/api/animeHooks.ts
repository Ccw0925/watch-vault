import { fetchTopAnimes } from "@/lib/api/animeService";
import { TopAnimesResponse } from "@/types/anime";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useTopAnimes = ({ page }: { page?: number }) => {
  return useQuery<TopAnimesResponse, Error>({
    queryKey: ["animes", { page }],
    queryFn: () => fetchTopAnimes({ page }),
    placeholderData: keepPreviousData,
  });
};

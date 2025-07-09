import {
  addAnimeToWatchlist,
  fetchAnimeWatchlist,
  removeAnimeFromWatchlist,
} from "@/lib/api/watchlistService";
import { WatchlistResponse } from "@/types/watchlist";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAnimeWatchlist = () => {
  return useQuery<WatchlistResponse, Error>({
    queryKey: ["animeWatchlist"],
    queryFn: () => fetchAnimeWatchlist(),
  });
};

export const useAddAnimeToWatchlist = () => {
  return useMutation({
    mutationFn: (animeId: number) => addAnimeToWatchlist(animeId),
    onSuccess: () => {
      toast.success("Success", {
        description: "Anime added to watchlist",
      });
    },
  });
};

export const useRemoveAnimeFromWatchlist = () => {
  return useMutation({
    mutationFn: (animeId: number) => removeAnimeFromWatchlist(animeId),
    onSuccess: () => {
      toast.success("Success", {
        description: "Anime removed from watchlist",
      });
    },
  });
};

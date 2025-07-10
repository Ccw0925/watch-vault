import {
  addAnimeToWatchlist,
  fetchAnimeWatchlist,
  removeAnimeFromWatchlist,
  updateWatchlistStatus,
} from "@/lib/api/watchlistService";
import { WatchlistResponse, WatchStatus } from "@/types/watchlist";
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
        description: "Anime added to watchlist.",
      });
    },
  });
};

export const useRemoveAnimeFromWatchlist = () => {
  return useMutation({
    mutationFn: (animeId: number) => removeAnimeFromWatchlist(animeId),
    onSuccess: () => {
      toast.success("Success", {
        description: "Anime removed from watchlist.",
      });
    },
  });
};

export const useUpdateWatchlistStatus = () => {
  return useMutation({
    mutationFn: (data: {
      animeId: number;
      status: WatchStatus;
      progress?: number;
    }) => updateWatchlistStatus(data.animeId, data.status, data.progress),
    onSuccess: () => {
      toast.success("Success", {
        description: "Watchlist status updated.",
      });
    },
  });
};

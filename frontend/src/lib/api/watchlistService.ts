import axios from "axios";
import { getGuestId } from "../guest/utils";
import {
  MutationResponse,
  WatchlistResponse,
  WatchStatus,
} from "@/types/watchlist";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "X-Guest-ID": getGuestId(),
  },
});

export const fetchAnimeWatchlist = async (): Promise<WatchlistResponse> => {
  const response = await api.get<WatchlistResponse>("/watchlist");
  return response.data;
};

export const addAnimeToWatchlist = async (
  animeId: number
): Promise<MutationResponse> => {
  const response = await api.post<MutationResponse>(`/watchlist/${animeId}`);
  return response.data;
};

export const removeAnimeFromWatchlist = async (
  animeId: number
): Promise<MutationResponse> => {
  const response = await api.delete<MutationResponse>(`/watchlist/${animeId}`);
  return response.data;
};

export const updateWatchlistStatus = async (
  animeId: number,
  status: WatchStatus,
  progress?: number
): Promise<MutationResponse> => {
  const response = await api.patch<MutationResponse>(`/watchlist/${animeId}`, {
    status,
    progress,
  });
  return response.data;
};

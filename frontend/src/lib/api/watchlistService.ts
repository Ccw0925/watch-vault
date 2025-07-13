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

export const fetchAnimeWatchlist = async (options?: {
  limit?: number;
  status?: WatchStatus;
  startCursor?: string;
  endCursor?: string;
  direction?: "prev" | "next";
}): Promise<WatchlistResponse> => {
  const params = new URLSearchParams();

  if (options?.limit && options?.limit !== undefined) {
    params.append("limit", options.limit.toString());
  }

  if (options?.status && options?.status !== undefined) {
    params.append("status", options.status);
  }

  if (options?.startCursor && options?.startCursor !== undefined) {
    params.append("startCursor", options.startCursor);
  }

  if (options?.endCursor && options?.endCursor !== undefined) {
    params.append("endCursor", options.endCursor);
  }

  if (options?.direction && options?.direction !== undefined) {
    params.append("direction", options.direction);
  }

  const response = await api.get<WatchlistResponse>("/watchlist", { params });
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

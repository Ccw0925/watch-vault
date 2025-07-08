import axios from "axios";
import { getGuestId } from "../guest/utils";
import { Response } from "@/types/watchlist";
import { Anime } from "@/types/anime";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "X-Guest-ID": getGuestId(),
  },
});

export const fetchAnimeWatchlist = async (): Promise<Anime[]> => {
  const response = await api.get<Anime[]>("/watchlist");
  return response.data;
};

export const addAnimeToWatchlist = async (
  animeId: number
): Promise<Response> => {
  const response = await api.post<Response>(`/watchlist/${animeId}`);
  return response.data;
};

export const removeAnimeFromWatchlist = async (
  animeId: number
): Promise<Response> => {
  const response = await api.delete<Response>(`/watchlist/${animeId}`);
  return response.data;
};

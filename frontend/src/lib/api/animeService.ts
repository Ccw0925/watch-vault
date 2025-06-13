import { Anime, AnimesResponse } from "@/types/anime";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const fetchAnimes = async (options?: {
  page?: number;
  genres?: string;
  rating?: string;
}): Promise<AnimesResponse> => {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  if (options?.genres !== undefined) {
    params.append("genres", options.genres);
  }

  if (options?.rating !== undefined) {
    params.append("rating", options.rating);
  }

  const response = await api.get<AnimesResponse>("/animes", { params });
  return response.data;
};

export const fetchAnimeById = async (id: string): Promise<Anime> => {
  const response = await api.get<Anime>(`/animes/${id}`);
  return response.data;
};

export const fetchTopAnimes = async (options?: {
  page?: number;
}): Promise<AnimesResponse> => {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  const response = await api.get<AnimesResponse>("/animes/top", { params });

  const sortedData = {
    ...response.data,
    data: response.data.data.sort(sortByRank),
  };

  return sortedData;
};

const sortByRank = (a: { rank: number }, b: { rank: number }) => {
  if (a.rank === 0) return 1;
  if (b.rank === 0) return -1;
  return a.rank - b.rank;
};

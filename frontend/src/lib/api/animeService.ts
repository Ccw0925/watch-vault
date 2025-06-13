import { Anime, AnimesResponse } from "@/types/anime";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const fetchAnimes = async (options?: {
  page?: number;
  genres?: string | null;
  rating?: string | null;
  orderBy?: string | null;
  sort?: string | null;
}): Promise<AnimesResponse> => {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  if (options?.genres && options?.genres !== undefined) {
    params.append("genres", options.genres);
  }

  if (options?.rating && options?.rating !== undefined) {
    params.append("rating", options.rating);
  }

  if (options?.orderBy && options?.orderBy !== undefined) {
    params.append("order_by", options.orderBy);
  }

  if (options?.sort && options?.sort !== undefined) {
    params.append("sort", options.sort);
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

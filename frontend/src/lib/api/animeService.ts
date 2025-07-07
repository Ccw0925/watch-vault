import {
  Anime,
  AnimeCharacter,
  AnimesResponse,
  EpisodesResponse,
  SeasonalAnimesResponse,
} from "@/types/anime";
import axios from "axios";
import { getGuestId } from "../guest/utils";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "X-Guest-ID": getGuestId(),
  },
});

export const fetchAnimes = async (options?: {
  page?: number;
  limit?: number;
  genres?: string | null;
  rating?: string | null;
  orderBy?: string | null;
  sort?: string | null;
  queryString?: string | null;
}): Promise<AnimesResponse> => {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  if (options?.limit && options?.limit !== undefined) {
    params.append("limit", options.limit.toString());
  }

  if (options?.genres && options?.genres !== undefined) {
    params.append("genres", options.genres);
  }

  if (options?.rating && options?.rating !== undefined) {
    params.append("rating", options.rating);
  }

  if (options?.orderBy && options?.orderBy !== undefined) {
    params.append("orderBy", options.orderBy);
  }

  if (options?.sort && options?.sort !== undefined) {
    params.append("sort", options.sort);
  }

  if (options?.queryString && options?.queryString !== undefined) {
    params.append("q", options.queryString);
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
  limit?: number;
}): Promise<AnimesResponse> => {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  if (options?.limit && options?.limit !== undefined) {
    params.append("limit", options.limit.toString());
  }

  const response = await api.get<AnimesResponse>("/animes/top", { params });

  const sortedData = {
    ...response.data,
    data: response.data.data.sort(sortByRank),
  };

  return sortedData;
};

export const fetchAnimeEpisodes = async (
  animeId: string,
  options?: { page?: number }
): Promise<EpisodesResponse> => {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  const response = await api.get<EpisodesResponse>(
    `/animes/${animeId}/episodes`,
    {
      params,
    }
  );
  return response.data;
};

export const fetchAnimeCharactersById = async (
  id: string
): Promise<AnimeCharacter[]> => {
  const response = await api.get<AnimeCharacter[]>(`/animes/${id}/characters`);
  return response.data;
};

export const fetchUpcomingAnimes = async (options?: {
  page?: number;
  limit?: number;
}): Promise<AnimesResponse> => {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  if (options?.limit && options?.limit !== undefined) {
    params.append("limit", options.limit.toString());
  }

  const response = await api.get<AnimesResponse>("/animes/upcoming", {
    params,
  });

  return response.data;
};

export const fetchSeasonalAnimes = async (
  year: number,
  season: string,
  options?: { page?: number }
): Promise<SeasonalAnimesResponse> => {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  const response = await api.get<SeasonalAnimesResponse>(
    `/animes/seasons/${year}/${season}`,
    {
      params,
    }
  );

  return response.data;
};

export const fetchDeveloperRecommendations = async (): Promise<Anime[]> => {
  const response = await api.get<Anime[]>("/animes/developer-recommendations");
  return response.data;
};

const sortByRank = (a: { rank: number }, b: { rank: number }) => {
  if (a.rank === 0) return 1;
  if (b.rank === 0) return -1;
  return a.rank - b.rank;
};

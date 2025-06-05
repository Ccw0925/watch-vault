import { TopAnimesResponse } from "@/types/anime";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const fetchTopAnimes = async (options?: {
  page?: number;
}): Promise<TopAnimesResponse> => {
  const params = new URLSearchParams();

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  const response = await api.get<TopAnimesResponse>("/animes/top", { params });

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

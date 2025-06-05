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
  return response.data;
};

import axios from "axios";
import { Movie } from "@/types/movie";

const api = axios.create({
  baseURL: "/api",
});

export const fetchMovies = async (options?: {
  pageSize?: number;
  page?: number;
}): Promise<Movie[]> => {
  const params = new URLSearchParams();

  if (options?.pageSize !== undefined) {
    params.append("limit", options.pageSize.toString());
  }

  if (options?.page !== undefined) {
    params.append("offset", options.page.toString());
  }

  const response = await api.get<Movie[]>("/movies", { params });
  return response.data;
};

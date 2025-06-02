import axios from "axios";
import { Movie } from "@/types/movie";
import { PaginationResource } from "@/types/paginationResource";

const api = axios.create({
  baseURL: "/api",
});

export const fetchMovies = async (options?: {
  pageSize?: number;
  page?: number;
}): Promise<PaginationResource<Movie>> => {
  const params = new URLSearchParams();

  if (options?.pageSize !== undefined) {
    params.append("pageSize", options.pageSize.toString());
  }

  if (options?.page !== undefined) {
    params.append("page", options.page.toString());
  }

  const response = await api.get<PaginationResource<Movie>>("/movies", {
    params,
  });
  return response.data;
};

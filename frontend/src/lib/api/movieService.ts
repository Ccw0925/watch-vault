import axios from "axios";
import { Movie } from "@/types/movie";

const api = axios.create({
  baseURL: "/api",
});

export const fetchMovies = async (): Promise<Movie[]> => {
  const response = await api.get<Movie[]>("/movies");
  return response.data;
};

import { fetchMovies } from "@/lib/api/movieService";
import { Movie } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";

export const useMovies = () => {
  return useQuery<Movie[], Error>({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });
};

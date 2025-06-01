import { fetchMovies } from "@/lib/api/movieService";
import { Movie } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";

export const useMovies = ({
  pageSize,
  page,
}: {
  pageSize?: number;
  page?: number;
}) => {
  return useQuery<Movie[], Error>({
    queryKey: ["movies", { pageSize, page }],
    queryFn: () => fetchMovies({ pageSize, page }),
  });
};

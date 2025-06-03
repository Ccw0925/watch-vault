import { fetchMovies } from "@/lib/api/movieService";
import { Movie } from "@/types/movie";
import { PaginationResource } from "@/types/paginationResource";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useMovies = ({
  pageSize,
  page,
}: {
  pageSize?: number;
  page?: number;
}) => {
  return useQuery<PaginationResource<Movie>, Error>({
    queryKey: ["movies", { pageSize, page }],
    queryFn: () => fetchMovies({ pageSize, page }),
    placeholderData: keepPreviousData,
  });
};

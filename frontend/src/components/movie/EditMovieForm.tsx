"use client";

import React from "react";
import { z } from "zod";
import axios from "axios";
import { Movie } from "@/types/movie";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formSchema, MovieForm } from "./MovieForm";

const fetchMovieDetails = async (id: string): Promise<Movie> => {
  const response = await axios.get<Movie>(`/api/movies/${id}`);
  return response.data;
};

const updateMovie = async (movieData: {
  id: number;
  title: string;
  year: number;
}): Promise<Movie> => {
  const { id, ...updatedMovieData } = movieData;
  const response = await axios.patch<Movie>(
    `/api/movies/${id}`,
    updatedMovieData
  );
  return response.data;
};

const EditMovieForm = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data: movieData, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateMovie,
    onSuccess: (data) => {
      toast.success("Success!", {
        description: `Movie "${data.title}" updated successfully.`,
      });
      router.push(`/movies/${data.id}`);
    },
    onError: (error) => {
      toast.error("Error", {
        description: "Failed to update movie. Please try again.",
      });
      console.error("Error updating movie:", error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ id: parseInt(id), ...movieData, ...values });
  }

  return (
    <MovieForm
      defaultValues={movieData}
      onSubmit={onSubmit}
      isPending={isPending || isLoading}
      title="Edit Movie"
      submitButtonText="Update"
    />
  );
};

export default EditMovieForm;

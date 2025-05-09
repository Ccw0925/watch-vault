"use client";

import React from "react";
import { z } from "zod";
import axios from "axios";
import { Movie } from "@/types/movie";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formSchema, MovieForm } from "@/components/movie/MovieForm";

const createMovie = async (movieData: {
  title: string;
  year: number;
}): Promise<Movie> => {
  const response = await axios.post<Movie>("/api/movies", movieData);
  return response.data;
};

const CreateMovieForm = () => {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createMovie,
    onSuccess: (data) => {
      toast.success("Success!", {
        description: `Movie "${data.title}" created successfully.`,
      });
      router.push(`/movies/${data.id}`);
    },
    onError: (error) => {
      toast.error("Error", {
        description: "Failed to create movie. Please try again.",
      });
      console.error("Error creating movie:", error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, year } = values;
    return mutateAsync({ title, year });
  }

  return (
    <MovieForm
      onSubmit={onSubmit}
      isPending={isPending}
      title="Create Movie"
      submitButtonText="Submit"
    />
  );
};

export default CreateMovieForm;

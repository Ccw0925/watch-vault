"use client";
import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Movie } from "@/types/movie";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TypographyH1 } from "../ui/typography";

const formSchema = z.object({
  title: z.string().min(1).max(100),
  year: z.coerce.number().min(1888),
});

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

const MovieForm = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data: movieData, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      year: "" as unknown as number,
    },
  });

  useEffect(() => {
    if (movieData) {
      form.reset({
        title: movieData.title,
        year: movieData.year,
      });
    }
  }, [movieData, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateMovie,
    onSuccess: (data) => {
      toast.success("Success!", {
        description: `Movie "${data.title}" updated successfully.`,
      });
      form.reset();
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
    <div className="p-5">
      <TypographyH1 className="mb-4">Edit Movie</TypographyH1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Movie title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 1990"
                    type="number"
                    min={1888}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the movie release year.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="text-white cursor-pointer"
            disabled={isPending || isLoading}
          >
            {isPending ? "Updating..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MovieForm;

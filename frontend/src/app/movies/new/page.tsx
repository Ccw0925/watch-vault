"use client";

import { TypographyH1 } from "@/components/ui/typography";
import React from "react";

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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1).max(100),
  year: z.coerce.number().min(1888),
});

const createMovie = async (movieData: {
  title: string;
  year: number;
}): Promise<Movie> => {
  const response = await axios.post<Movie>("/api/movies", movieData);
  return response.data;
};

const CreateMovieForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      year: "" as unknown as number,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createMovie,
    onSuccess: (data) => {
      toast.success("Success!", {
        description: `Movie "${data.title}" created successfully.`,
      });
      form.reset();
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
    mutate(values);
  }

  return (
    <div className="p-5">
      <TypographyH1 className="mb-4">Create Movie</TypographyH1>

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
          <Button type="submit" className="text-white cursor-pointer" disabled={isPending}>
            {isPending ? "Creating..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateMovieForm;

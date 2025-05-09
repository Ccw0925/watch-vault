"use client";
import React, { useEffect, useState } from "react";
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
import { TypographyH1 } from "../ui/typography";
import { toast } from "sonner";
import { Movie } from "@/types/movie";
import Image from "next/image";

export const formSchema = z.object({
  title: z.string().min(1).max(100),
  year: z.coerce.number().min(1889),
});

type MovieFormProps = {
  defaultValues?: Movie;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<Movie> | void;
  isPending: boolean;
  title: string;
  submitButtonText: string;
};

export const MovieForm = ({
  defaultValues,
  onSubmit,
  isPending,
  title,
  submitButtonText,
}: MovieFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { id: existingMovieId, imagePath: existingImagePath } =
    defaultValues || {};
  const imageSrc =
    previewUrl || (existingImagePath ? `http://localhost:8080/${existingImagePath}` : null);

    console.log(imageSrc, existingImagePath)

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Clean up the object URL when the component unmounts or when selectedFile changes
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      title: "",
      year: "" as unknown as number,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Maximum file size is 10MB",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadImage = async (movieId: string) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setIsUploading(true);
      const response = await fetch(`/api/movies/${movieId}/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      toast.success("Success", {
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          "Failed to upload image: " +
          (error instanceof Error && error.message),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // First submit the movie data
      const movie = await onSubmit(values);

      // Determine the movie ID:
      // - For edit flow, we have existingMovieId
      // - For create flow, we get the ID from the onSubmit result
      const movieId = String(existingMovieId) || String(movie?.id);

      if (!movieId) {
        throw new Error("Could not determine movie ID");
      }

      // Then upload the image if one was selected
      if (selectedFile) {
        await uploadImage(movieId);
      }
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  return (
    <div className="p-5">
      <TypographyH1 className="mb-4">{title}</TypographyH1>

      {imageSrc && (
        <div className="relative w-[25%] aspect-square h-auto mb-5">
          <Image
            src={imageSrc}
            alt="Movie preview"
            fill
            className="object-contain rounded border"
          />
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
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
                    min={1889}
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

          <FormItem>
            <FormLabel>Movie Image</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </FormControl>
            <FormDescription>Upload a movie poster (max 10MB)</FormDescription>
          </FormItem>

          <Button
            type="submit"
            className="text-white cursor-pointer"
            disabled={isPending || isUploading}
          >
            {isPending || isUploading ? "Processing..." : submitButtonText}
          </Button>
        </form>
      </Form>
    </div>
  );
};

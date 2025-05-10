"use client";
import React, { useEffect, useState, useRef } from "react";
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

declare global {
  interface Permissions {
    query(
      permissionDesc:
        | PermissionDescriptor
        | { name: "clipboard-read" | "clipboard-write" }
    ): Promise<PermissionStatus>;
  }
}

export const formSchema = z.object({
  title: z.string().min(1).max(100),
  year: z.coerce.number().min(1889),
  imageUrl: z.string().optional(), // Add imageUrl to the form schema
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSourceType, setImageSourceType] = useState<
    "file" | "url" | "paste"
  >("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [canPaste, setCanPaste] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { id: existingMovieId, imagePath: existingImagePath } =
    defaultValues || {};
  const showExistingImage = existingImagePath && !previewUrl;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      year: "" as unknown as number,
      ...defaultValues,
      imageUrl: "",
    },
  });

  const imageUrl = form.watch("imageUrl");

  // Show preview when URL changes
  useEffect(() => {
    if (imageSourceType === "url" && imageUrl) {
      setPreviewUrl(imageUrl);
    }
  }, [imageUrl, imageSourceType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Maximum file size is 10MB",
        });
        return;
      }
      setSelectedFile(file);
      setImageSourceType("file");
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          if (blob.size > 10 * 1024 * 1024) {
            toast.error("Image too large", {
              description: "Maximum file size is 10MB",
            });
            return;
          }
          setSelectedFile(blob);
          setImageSourceType("paste");
          setPreviewUrl(URL.createObjectURL(blob));
          return;
        }
      }
    }
  };

  // Check clipboard permissions and contents
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        // Check if we have permission to read clipboard
        const permission = await navigator.permissions.query({
          name: "clipboard-read" as PermissionName,
        });
        setCanPaste(permission.state !== "denied");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Some browsers don't support the permissions API
        setCanPaste(true);
      }
    };
    checkClipboard();
  }, []);

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

      // Then upload the image if one was selected
      if (selectedFile) {
        // Determine the movie ID:
        // - For edit flow, we have existingMovieId
        // - For create flow, we get the ID from the onSubmit result
        const movieId =
          existingMovieId !== undefined
            ? String(existingMovieId)
            : String(movie?.id);

        if (!movieId) {
          throw new Error("Could not determine movie ID");
        }

        await uploadImage(movieId);
      }
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-5" onPaste={handlePaste}>
      <TypographyH1 className="mb-4">{title}</TypographyH1>

      {(previewUrl || showExistingImage) && (
        <div className="relative w-[25%] aspect-square h-auto mb-5">
          <Image
            src={previewUrl || `http://localhost:8080/${existingImagePath}`}
            alt="Movie preview"
            fill
            className="object-contain rounded border"
            unoptimized={!!previewUrl}
            onError={() => {
              toast.error("Invalid image", {
                description: "Could not load the image",
              });
              setPreviewUrl(null);
            }}
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
                <FormDescription>Movie release year</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel>Movie Image</FormLabel>

            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={imageSourceType === "file" ? "default" : "outline"}
                onClick={() => setImageSourceType("file")}
                className="text-white cursor-pointer"
              >
                Upload File
              </Button>
              <Button
                type="button"
                variant={imageSourceType === "url" ? "default" : "outline"}
                onClick={() => setImageSourceType("url")}
                className="text-white cursor-pointer"
              >
                Use URL
              </Button>
              {canPaste && (
                <Button
                  type="button"
                  variant={imageSourceType === "paste" ? "default" : "outline"}
                  onClick={() => {
                    setImageSourceType("paste");
                    toast.info("Press Ctrl+V to paste an image");
                  }}
                  className="text-white cursor-pointer"
                >
                  Paste Image
                </Button>
              )}
            </div>

            {imageSourceType === "file" ? (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </FormControl>
                <FormDescription>
                  Upload a movie poster (max 10MB)
                </FormDescription>
              </FormItem>
            ) : imageSourceType === "url" ? (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter a valid image URL</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="border-2 border-dashed p-4 rounded-md text-center">
                <p>Press Ctrl+V to paste an image from your clipboard</p>
                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Image ready to be saved
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

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

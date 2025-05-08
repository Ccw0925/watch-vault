"use client";
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
import { TypographyH1 } from "../ui/typography";

export const formSchema = z.object({
  title: z.string().min(1).max(100),
  year: z.coerce.number().min(1889),
});

type MovieFormProps = {
  defaultValues?: z.infer<typeof formSchema>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void> | void;
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      title: "",
      year: "" as unknown as number,
    },
  });

  return (
    <div className="p-5">
      <TypographyH1 className="mb-4">{title}</TypographyH1>

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
          <Button
            type="submit"
            className="text-white cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Processing..." : submitButtonText}
          </Button>
        </form>
      </Form>
    </div>
  );
};

import React from "react";
import AnimeByGenrePage from "./AnimeByGenrePage";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await searchParams;

  return name
    ? {
        title: name,
      }
    : {};
}

const page = async () => <AnimeByGenrePage />;

export default page;

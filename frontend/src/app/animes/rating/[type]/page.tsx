import React from "react";
import AnimeByRatingPage from "./AnimeByRatingPage";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { name: string };
}): Promise<Metadata> {
  const { name } = await searchParams;

  return name
    ? {
        title: name,
      }
    : {};
}

const page = async () => <AnimeByRatingPage />;

export default page;

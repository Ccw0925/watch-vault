import React from "react";
import AnimeDetailsPage from "./AnimeDetailsPage";
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

const page = async () => <AnimeDetailsPage />;

export default page;

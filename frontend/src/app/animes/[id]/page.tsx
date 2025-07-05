import React from "react";
import AnimeDetailsPage from "./AnimeDetailsPage";
import { Metadata } from "next";
import { Anime } from "@/types/anime";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { name: string };
}): Promise<Metadata> {
  const { name } = await searchParams;

  if (name) {
    return { title: name };
  } else {
    const { id } = await params;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const { title }: Anime = await fetch(`${baseUrl}/api/animes/${id}`).then(
        (res) => res.json()
      );

      return title ? { title } : {};
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}

const page = async () => <AnimeDetailsPage />;

export default page;

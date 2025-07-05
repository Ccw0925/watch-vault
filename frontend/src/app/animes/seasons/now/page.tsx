import SeasonalAnimePage from "@/components/anime/SeasonalAnimePage";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Upcoming Animes",
};

const page = async () => (
  <Suspense>
    <SeasonalAnimePage />
  </Suspense>
);

export default page;

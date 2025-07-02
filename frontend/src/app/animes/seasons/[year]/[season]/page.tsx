import SeasonalAnimePage from "@/components/anime/SeasonalAnimePage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Seasonal Animes",
};

const page = async () => <SeasonalAnimePage />;

export default page;

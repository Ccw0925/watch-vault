import React from "react";
import AllAnimesPage from "./AllAnimesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Animes",
};

const Page = async () => <AllAnimesPage />;

export default Page;

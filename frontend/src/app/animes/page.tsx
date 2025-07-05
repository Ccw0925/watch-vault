import React, { Suspense } from "react";
import AllAnimesPage from "./AllAnimesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Animes",
};

const Page = async () => (
  <Suspense>
    <AllAnimesPage />
  </Suspense>
);

export default Page;

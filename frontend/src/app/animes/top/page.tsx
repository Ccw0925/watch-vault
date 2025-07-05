import React, { Suspense } from "react";
import TopAnimePage from "./TopAnimePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Animes",
};

const page = async () => (
  <Suspense>
    <TopAnimePage />
  </Suspense>
);

export default page;

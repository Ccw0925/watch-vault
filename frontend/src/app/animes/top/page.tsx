import React from "react";
import TopAnimePage from "./TopAnimePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Animes",
};

const page = async () => <TopAnimePage />;

export default page;

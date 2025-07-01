import { Metadata } from "next";
import React from "react";
import UpcomingAnimePage from "./UpcomingAnimePage";

export const metadata: Metadata = {
  title: "Upcoming Animes",
};

const page = async () => <UpcomingAnimePage />;

export default page;

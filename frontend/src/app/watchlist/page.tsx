import React from "react";
import WatchlistPage from "./WatchlistPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Watchlist",
};

const Page = async () => <WatchlistPage />;

export default Page;

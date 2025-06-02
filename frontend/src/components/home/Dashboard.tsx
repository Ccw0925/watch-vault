import React from "react";
import HighlightsBanner from "./HighlightsBanner";
import { twMerge } from "tailwind-merge";
import ContinueWatching from "./ContinueWatching";

const Dashboard = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge("p-5 overflow-y-auto flex flex-col gap-5", className)}
    >
      <HighlightsBanner />
      <ContinueWatching />
    </div>
  );
};

export default Dashboard;

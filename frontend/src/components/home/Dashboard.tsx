import React from "react";
import HighlightsBanner from "./HighlightsBanner";
import { twMerge } from "tailwind-merge";
import TopAnimesPreviewGroup from "./TopAnimesPreviewGroup";
import UpcomingAnimesPreviewGroup from "./UpcomingAnimesPreviewGroup";

const Dashboard = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge("py-5 md:px-5 flex flex-col gap-5", className)}>
      <HighlightsBanner />
      <TopAnimesPreviewGroup />
      <UpcomingAnimesPreviewGroup />
    </div>
  );
};

export default Dashboard;

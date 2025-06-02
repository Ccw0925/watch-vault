import React from "react";
import HighlightsBanner from "./HighlightsBanner";
import { twMerge } from "tailwind-merge";
import ContinueWatching from "./ContinueWatching";
// import {
//   TypographyH1,
//   TypographyH4,
//   TypographyP,
// } from "@/components/ui/typography";
// import { motion } from "motion/react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

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

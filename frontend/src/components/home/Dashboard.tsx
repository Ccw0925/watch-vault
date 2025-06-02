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

      {/* <div className="flex flex-wrap gap-y-3 gap-x-5 justify-center">
        {movies && movies.length > 0 ? (
          movies.map(({ id, title, year, watched, imagePath }) => (
            <Link key={id} href={`/movies/${id}`}>
              <motion.div
                className="h-[250px] rounded-xl flex flex-1 max-w-[400px] min-w-[350px] shadow-lg hover:shadow-xl hover:cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`flex-1 rounded-l-xl flex ${
                    imagePath ? "bg-black" : "bg-white"
                  }`}
                >
                  <Image
                    src={
                      imagePath
                        ? `http://localhost:8080/${imagePath}`
                        : "/placeholder.png"
                    }
                    width={200}
                    height={200}
                    alt="Picture of the movie"
                    className={`rounded-l-xl object-contain`}
                  />
                </div>
                <div className="dark:bg-gray-800 bg-gray-300 flex-1 rounded-r-xl p-5">
                  <TypographyH4 className="dark:text-white">{title}</TypographyH4>
                  <p className="dark:text-white font-inter">{year}</p>
                  <p className="dark:text-white font-inter">
                    Status: {watched ? "✅ Watched" : "⏳ Not Watched"}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <TypographyP>No movies found</TypographyP>
        )}
      </div> */}
    </div>
  );
};

export default Dashboard;

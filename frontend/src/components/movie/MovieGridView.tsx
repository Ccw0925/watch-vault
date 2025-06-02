import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

interface MovieGridViewProps {
  id: number;
  title: string;
  year: number;
  imagePath?: string;
}

const MovieGridView = ({ id, title, year, imagePath }: MovieGridViewProps) => {
  return (
    <div className="h-[350px] items-center py-5 flex flex-col gap-1">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-[215px] rounded-xl flex-1 dark:bg-[#22262c] bg-gray-300"
      >
        <Link href={`/movies/${id}`} className="relative block w-full h-full">
          <Image
            src={
              imagePath
                ? `http://localhost:8080/${imagePath}`
                : "/placeholder.png"
            }
            alt="Description of your image"
            fill
            sizes="215px"
            className={`rounded-xl ${
              imagePath ? "object-cover" : "object-contain"
            }`}
          />
        </Link>
      </motion.div>

      <div>
        <Link href={`/movies/${id}`}>
          <p className="font-inter">{title}</p>
        </Link>
      </div>

      <div>
        <Link href={`/movies/${id}`}>
          <p className="font-inter text-muted-foreground">{year}</p>
        </Link>
      </div>
    </div>
  );
};

export default MovieGridView;

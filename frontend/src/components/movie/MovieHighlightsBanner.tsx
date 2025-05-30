import React from "react";
import Image from "next/image";
import { TypographyH3 } from "../ui/typography";

const MovieHighlightsBanner = () => {
  return (
    <div className="flex justify-center">
      <div className="w-[85%] h-[600px] relative rounded-b-3xl rounded-tr-3xl">
        <div
          className={`
            absolute bg-background py-3 px-5 rounded-br-3xl z-1 
            after:w-[30px] after:h-[30px] after:bg-transparent after:absolute after:rounded-tl-3xl after:top-0 after:right-[-30px] after:shadow-[-0.5rem_-0.5rem_var(--background)] 
            before:w-[30px] before:h-[30px] before:bg-transparent before:absolute before:bottom-[-30px] before:left-0 before:shadow-[-0.5rem_-0.5rem_var(--background)] before:rounded-tl-3xl
          `}
        >
          <TypographyH3>BEST OF THE WEEK</TypographyH3>
        </div>

        <div className="relative h-full w-full rounded-b-3xl rounded-tr-3xl overflow-hidden">
          <Image
            src="/testing-banner.jpg"
            alt="Movie highlight"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 85vw"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default MovieHighlightsBanner;

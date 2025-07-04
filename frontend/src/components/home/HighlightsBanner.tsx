import React from "react";
import Image from "next/image";
import { TypographyH3 } from "../ui/typography";

const HighlightsBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <TypographyH3 className="text-center md:hidden block">
        Developer&apos;s Recommendations
      </TypographyH3>

      <div className="w-full h-[600px] md:block hidden relative rounded-b-3xl rounded-tr-3xl">
        <div
          className={`
            absolute bg-background py-3 px-5 rounded-br-3xl z-1 
            after:w-[30px] after:h-[30px] after:bg-transparent after:absolute after:rounded-tl-3xl after:top-0 after:right-[-30px] after:shadow-[-0.5rem_-0.5rem_var(--background)] 
            before:w-[30px] before:h-[30px] before:bg-transparent before:absolute before:bottom-[-30px] before:left-0 before:shadow-[-0.5rem_-0.5rem_var(--background)] before:rounded-tl-3xl
            md:block hidden
          `}
        >
          <TypographyH3>Developer&apos;s Recommendations</TypographyH3>
        </div>

        <div className="relative h-full w-full rounded-b-3xl rounded-tr-3xl overflow-hidden md:block hidden">
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

      <Image
        src={"https://cdn.myanimelist.net/images/anime/1079/138100l.webp"}
        alt={"title"}
        height={600}
        width={400}
        className="object-cover md:hidden block rounded-3xl"
        priority
      />
    </div>
  );
};

export default HighlightsBanner;

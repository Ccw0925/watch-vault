import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import React from "react";

const AnimeSynopsis = ({
  synopsis,
  shouldShowMore,
  showMore,
  setShowMore,
  synopsisRef,
}: {
  synopsis: string;
  shouldShowMore: boolean;
  showMore: boolean;
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
  synopsisRef: React.RefObject<HTMLParagraphElement | null>;
}) => (
  <div className="flex flex-col gap-2">
    <TypographyP
      ref={synopsisRef}
      className={`text-justify whitespace-pre-line line-clamp-7 ${
        showMore && "line-clamp-none"
      }`}
    >
      {synopsis}
    </TypographyP>

    {shouldShowMore && (
      <div className="flex flex-col items-center">
        <Button
          className="font-inter dark:bg-input/30 dark:hover:bg-input/50 font-medium text-white cursor-pointer h-10 rounded-md"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </div>
    )}
  </div>
);

export default AnimeSynopsis;

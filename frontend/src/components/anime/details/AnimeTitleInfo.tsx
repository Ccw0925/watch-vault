import { TypographyH3, TypographyMuted } from '@/components/ui/typography';
import { Anime } from '@/types/anime';
import React from 'react'

const AnimeTitleInfo = ({ anime }: { anime: Anime }) => (
  <>
    <TypographyH3 className="text-3xl">{anime.title}</TypographyH3>
    {anime.englishTitle && (
      <TypographyMuted className="text-base">
        {anime.englishTitle}
      </TypographyMuted>
    )}
    {anime.japaneseTitle && (
      <TypographyMuted className="text-base">
        {anime.japaneseTitle}
      </TypographyMuted>
    )}
  </>
);

export default AnimeTitleInfo
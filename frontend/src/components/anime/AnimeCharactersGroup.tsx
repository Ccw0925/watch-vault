import React from "react";
import { TypographyH3, TypographyMuted } from "../ui/typography";
import { Users } from "lucide-react";
import { useAnimeCharacters } from "@/hooks/api/animeHooks";
import AnimeCharacterCard, { CharactersSkeleton } from "./AnimeCharacterCard";
import CustomPagination from "../CustomPagination";

const CHARACTERS_PER_PAGE = 15;

const AnimeCharactersGroup = ({ id }: { id: string }) => {
  const { data: characters, isLoading } = useAnimeCharacters(id);
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil((characters?.length ?? 0) / CHARACTERS_PER_PAGE);
  const displayedCharacters = characters?.slice(
    (currentPage - 1) * CHARACTERS_PER_PAGE,
    currentPage * CHARACTERS_PER_PAGE
  );

  return (
    <div>
      <div className="mb-5 mt-2">
        <div className="flex gap-2 items-center">
          <Users />
          <TypographyH3>Characters & Voice Actors</TypographyH3>
        </div>

        {characters && characters.length > 0 && (
          <TypographyMuted className="mt-1">
            {characters.length} characters found.
          </TypographyMuted>
        )}
      </div>

      {isLoading ? (
        <CharactersSkeleton />
      ) : (
        <>
          {displayedCharacters && displayedCharacters.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                {displayedCharacters.map((character) => (
                  <AnimeCharacterCard
                    key={character.character.mal_id}
                    {...character}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setPage={setCurrentPage}
                  useRouter={false}
                />
              )}
            </>
          ) : (
            <TypographyMuted>No characters found.</TypographyMuted>
          )}
        </>
      )}
    </div>
  );
};

export default AnimeCharactersGroup;

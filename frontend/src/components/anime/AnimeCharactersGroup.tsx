import React from "react";
import { TypographyH3, TypographyMuted } from "../ui/typography";
import { Users } from "lucide-react";
import { useAnimeCharacters } from "@/hooks/api/animeHooks";
import AnimeCharacterCard, { CharactersSkeleton } from "./AnimeCharacterCard";

const AnimeCharactersGroup = ({ id }: { id: string }) => {
  const { data: characters, isLoading } = useAnimeCharacters(id);

  return (
    <div>
      <div className="flex gap-2 items-center mb-5 mt-2">
        <Users />
        <TypographyH3>Characters & Voice Actors</TypographyH3>
      </div>

      {isLoading ? (
        <CharactersSkeleton />
      ) : (
        <>
          {characters && characters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map((character) => (
                <AnimeCharacterCard
                  key={character.character.mal_id}
                  {...character}
                />
              ))}
            </div>
          ) : (
            <TypographyMuted>No characters found.</TypographyMuted>
          )}
        </>
      )}
    </div>
  );
};

export default AnimeCharactersGroup;

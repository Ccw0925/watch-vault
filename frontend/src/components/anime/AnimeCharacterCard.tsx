import { AnimeCharacter } from "@/types/anime";
import Image from "next/image";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

const AnimeCharacterCard = ({
  character,
  role,
  voice_actors,
}: Pick<AnimeCharacter, "character" | "role" | "voice_actors">) => {
  return (
    <div
      key={character.mal_id}
      className="border font-inter p-4 rounded-lg grid grid-rows-subgrid grid-cols-[auto_1fr] gap-3 shadow-sm"
    >
      <div>
        <div className="aspect-[9/14] w-[100px] rounded-lg bg-card relative overflow-hidden">
          <Image
            src={character.images.webp.image_url}
            alt="Character Image"
            fill
            className="object-cover"
            sizes="100px"
          />
        </div>
      </div>
      <div>
        <p className="font-inter font-bold">{character.name}</p>
        <p className="font-inter text-muted-foreground">{role}</p>
        {voice_actors.length > 0 && (
          <VoiceActorsInfo voice_actors={voice_actors} />
        )}
      </div>
    </div>
  );
};

const VoiceActorsInfo = ({
  voice_actors: voiceActors,
}: Pick<AnimeCharacter, "voice_actors">) => {
  const displayedVA =
    voiceActors.find((va) => va.language === "Japanese")?.person ??
    voiceActors[0].person;

  return (
    <>
      <p className="font-inter mt-2 text-muted-foreground text-sm">
        Voice Actor/Actress:{" "}
      </p>
      <Link
        href={displayedVA.url}
        target="_blank"
        className="hover:text-blue-500"
      >
        <p className="font-inter">{displayedVA.name}</p>
      </Link>
    </>
  );
};

export const CharactersSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="border font-inter p-4 rounded-lg grid grid-rows-subgrid grid-cols-[auto_1fr] gap-3"
      >
        <div>
          <div className="aspect-[9/14] w-[100px] rounded-lg bg-card relative overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-[30%]" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-4 w-[35%] mt-2" />
          <Skeleton className="h-5 w-[25%]" />
        </div>
      </div>
    ))}
  </div>
);

export default React.memo(AnimeCharacterCard);

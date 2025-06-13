"use client";
import AnimeInfoCard from "@/components/anime/AnimeInfoCard";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TypographyH3,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import { useAnimeById } from "@/hooks/api/animeHooks";
import { Anime } from "@/types/anime";
import {
  Award,
  Bookmark,
  Calendar,
  Clock,
  Heart,
  Play,
  SquareArrowOutUpRight,
  Star,
  Swords,
  Tag,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const AnimeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: anime, isLoading } = useAnimeById(id);

  return (
    <div className="p-5 lg:p-8 flex flex-col mx-auto w-full max-w-[1850px]">
      <div className="flex mb-8 justify-between">
        <BackButton redirectUrl="/animes/top" />
        <Button
          variant="outline"
          className="cursor-pointer font-inter"
          disabled={isLoading || anime === undefined}
        >
          <Bookmark /> Bookmark
        </Button>
      </div>
      {isLoading || anime === undefined ? (
        <PageSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_350px] gap-5 lg:gap-10 mb-12">
          <div className="md:col-span-2 space-y-6 order-2 lg:order-none">
            <AnimeTitleInfo anime={anime} />
            <AnimeStatsBadges anime={anime} />

            <TypographyP className="text-justify whitespace-pre-line">
              {anime.synopsis}
            </TypographyP>

            <AnimeInfoCardGroup anime={anime} />

            <StudiosInfo studios={anime.studios} />
            <ProducersInfo producers={anime.producers} />
            <GenresInfo genres={anime.genres} />
            <ThemesInfo themes={anime.themes} />
            <DemographicsInfo demographics={anime.demographics} />
          </div>

          <div className="relative order-1 lg:order-none">
            <ImageInfoGroup images={anime.images} url={anime.url} />
          </div>
        </div>
      )}
    </div>
  );
};

const PageSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_350px] gap-8 mb-12">
    <div className="md:col-span-2 space-y-6 order-2 lg:order-none">
      <Skeleton className="h-9 w-[25%]" />
      <Skeleton className="h-5 w-[15%]" />
      <Skeleton className="h-5 w-[20%]" />
      <Skeleton className="h-[180px]" />
    </div>
    <div className="relative order-1 lg:order-none">
      <div className="sticky top-8 flex flex-col gap-4 h-[600px] max-w-[350px] mx-auto lg:mx-0">
        <div className="relative w-full h-[85%] rounded-xl overflow-hidden">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

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

const AnimeStatsBadges = ({ anime }: { anime: Anime }) => (
  <div className="flex flex-wrap gap-2 items-center">
    <div className="flex items-center gap-1 py-1 px-2 rounded-full bg-secondary hover:bg-secondary/80">
      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
      <p className="font-bold text-xs font-inter">{anime.score.toFixed(2)}</p>
      <p className="text-xs text-muted-foreground font-inter">
        ({anime.scoredBy.toLocaleString()})
      </p>
    </div>

    <p className="text-xs font-inter px-2 py-1 rounded-full border font-medium">
      {anime.rating}
    </p>

    <p className="text-xs font-inter px-2 py-1 rounded-full border font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
      {anime.status}
    </p>

    {anime.year > 0 && (
      <p className="text-xs font-inter px-2 py-1 rounded-full border font-medium capitalize">
        {`${anime.season} ${anime.year}`}
      </p>
    )}
  </div>
);

const AnimeInfoCardGroup = ({ anime }: { anime: Anime }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
    <AnimeInfoCard
      icon={Calendar}
      cardTitle="Aired"
      cardDescription={anime.aired.string}
    />
    <AnimeInfoCard
      icon={Clock}
      cardTitle="Duration"
      cardDescription={anime.duration}
    />
    <AnimeInfoCard
      icon={Play}
      cardTitle="Episodes"
      cardDescription={anime.episodes > 0 ? anime.episodes.toString() : "N/A"}
    />
    <AnimeInfoCard
      icon={Users}
      cardTitle="Members"
      cardDescription={anime.members.toLocaleString()}
    />
    <AnimeInfoCard
      icon={Award}
      cardTitle="Rank"
      cardDescription={`#${anime.rank}`}
    />
    <AnimeInfoCard
      icon={Heart}
      cardTitle="Favorites"
      cardDescription={anime.favourites.toLocaleString()}
    />
  </div>
);

const StudiosInfo = ({ studios }: Pick<Anime, "studios">) => {
  return (
    studios.length > 0 && (
      <div>
        <h3 className="font-semibold mb-3 font-inter">Studios</h3>
        <div className="flex flex-wrap gap-2">
          {studios.map(({ name, mal_id, url }) => (
            <Link key={mal_id} href={url}>
              <Button
                variant="outline"
                className="cursor-pointer rounded-3xl font-inter"
              >
                {name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

const ProducersInfo = ({ producers }: Pick<Anime, "producers">) => {
  return (
    producers.length > 0 && (
      <div>
        <h3 className="font-semibold mb-3 font-inter">Producers</h3>
        <div className="flex flex-wrap gap-2">
          {producers.map(({ name, mal_id, url }) => (
            <Link key={mal_id} href={url}>
              <Button
                variant="outline"
                className="cursor-pointer rounded-3xl font-inter"
              >
                {name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

const GenresInfo = ({ genres }: Pick<Anime, "genres">) => {
  return (
    genres.length > 0 && (
      <div>
        <div className="flex gap-1 items-center mb-3">
          <h3 className="font-semibold font-inter">Genres</h3>
          <Tag className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map(({ name, mal_id }) => (
            <Link key={mal_id} href={`/animes/genre/${mal_id}?name=${name}`}>
              <Button className="cursor-pointer rounded-3xl font-inter text-xs text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 hover:shadow-md">
                {name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

const ThemesInfo = ({ themes }: Pick<Anime, "themes">) => {
  return (
    themes.length > 0 && (
      <div>
        <div className="flex gap-1 items-center mb-3">
          <h3 className="font-semibold font-inter">Themes</h3>
          <Swords className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {themes.map(({ name, mal_id }) => (
            <Link key={mal_id} href={`/animes/genre/${mal_id}?name=${name}`}>
              <Button className="cursor-pointer rounded-3xl font-inter text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 hover:shadow-md">
                {name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

const DemographicsInfo = ({ demographics }: Pick<Anime, "demographics">) => {
  return (
    demographics.length > 0 && (
      <div>
        <div className="flex gap-1 items-center mb-3">
          <h3 className="font-semibold font-inter">Demographics</h3>
          <Users className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {demographics.map(({ name, mal_id }) => (
            <Link key={mal_id} href={`/animes/genre/${mal_id}?name=${name}`}>
              <Button className="cursor-pointer rounded-3xl font-inter text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 hover:shadow-md">
                {name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

const ImageInfoGroup = ({ images, url }: Pick<Anime, "images" | "url">) => (
  <div className="sticky top-8 flex flex-col gap-4 h-[600px] max-w-[350px] mx-auto lg:mx-0">
    <div className="relative w-full h-[85%] rounded-xl overflow-hidden">
      <Image
        src={images.webp.large_image_url}
        alt="Anime Poster"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 350px"
        priority
      />
    </div>
    <div className="flex gap-3">
      <div className="flex-1">
        <Button className="font-inter w-full dark:bg-input/30 dark:hover:bg-input/50 font-medium text-white cursor-pointer h-12 rounded-xl">
          <Play />
          Watch Trailer
        </Button>
      </div>
      <div className="flex-1">
        <Link href={url} target="_blank">
          <Button className="font-inter w-full dark:bg-input/30 dark:hover:bg-input/50 font-medium text-white cursor-pointer h-12 rounded-xl">
            <SquareArrowOutUpRight />
            MyAnimeList
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default AnimeDetailsPage;

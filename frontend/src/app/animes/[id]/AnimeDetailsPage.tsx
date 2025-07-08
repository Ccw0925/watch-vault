"use client";
import AnimeCharactersGroup from "@/components/anime/AnimeCharactersGroup";
import AnimeEpisodesGroup from "@/components/anime/AnimeEpisodesGroup";
import AnimeInfoCard from "@/components/anime/AnimeInfoCard";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TypographyH1,
  TypographyH3,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import { useAnimeById } from "@/hooks/api/animeHooks";
import { getRatingKey } from "@/lib/anime/rating/utils";
import { Anime } from "@/types/anime";
import {
  Award,
  Bookmark,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  List,
  Play,
  SquareArrowOutUpRight,
  Star,
  Swords,
  Tag,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import FeatureUnderDevelopmentDialog from "@/components/FeatureUnderDevelopmentDialog";

const AnimeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: anime, isLoading } = useAnimeById(id);
  const [showMore, setShowMore] = useState(false);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const synopsisRef = useRef<HTMLParagraphElement>(null);

  const checkTextOverflow = useCallback(() => {
    if (synopsisRef.current) {
      const lineHeight = parseInt(
        getComputedStyle(synopsisRef.current).lineHeight
      );
      const maxHeight = lineHeight * 7;
      const actualHeight = synopsisRef.current.scrollHeight;

      setShouldShowMore(actualHeight > maxHeight);
    }
  }, []);

  useEffect(() => {
    checkTextOverflow();

    const debouncedCheck = debounce(checkTextOverflow, 200);
    window.addEventListener("resize", debouncedCheck);

    return () => {
      window.removeEventListener("resize", debouncedCheck);
    };
  }, [checkTextOverflow, anime?.synopsis]);

  const debounce = (func: () => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(), wait);
    };
  };

  if (!isLoading && !anime)
    return (
      <div className="mt-5">
        <TypographyH1 className="text-center">Anime not found.</TypographyH1>
        <Link href="/animes" className="flex justify-center mt-5">
          <Button className="font-inter text-white cursor-pointer">
            Back to Anime List
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="p-5 lg:p-8 flex flex-col mx-auto w-full max-w-[1850px]">
      <div className="flex mb-8 justify-between">
        <BackButton redirectUrl="/animes/top" />
        <FeatureUnderDevelopmentDialog>
          <Button
            variant="outline"
            className="group cursor-pointer font-inter"
            disabled={isLoading || anime === undefined}
          >
            <Bookmark
              className={
                anime?.inWatchlist
                  ? "group-hover:fill-none fill-white"
                  : "group-hover:fill-white fill-none"
              }
            />{" "}
            {anime?.inWatchlist ? "Saved" : "Add to Watchlist"}
          </Button>
        </FeatureUnderDevelopmentDialog>
      </div>

      {isLoading || anime === undefined ? (
        <PageSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_350px] gap-5 lg:gap-10 mb-8">
            <AnimePrequelSequelGroup
              relations={anime.relations}
              classname="lg:hidden grid"
            />

            <div className="lg:col-span-2 space-y-6 order-2 lg:order-none">
              <AnimePrequelSequelGroup
                relations={anime.relations}
                classname="hidden lg:grid"
              />
              <AnimeTitleInfo anime={anime} />
              <AnimeStatsBadges anime={anime} />
              <AnimeSynopsis
                synopsis={anime.synopsis}
                shouldShowMore={shouldShowMore}
                showMore={showMore}
                setShowMore={setShowMore}
                synopsisRef={synopsisRef}
              />
              <AnimeInfoCardGroup anime={anime} />
              <StudiosInfo studios={anime.studios} />
              <ProducersInfo producers={anime.producers} />
              <GenresInfo genres={anime.genres} />
              <ThemesInfo themes={anime.themes} />
              <DemographicsInfo demographics={anime.demographics} />
            </div>

            <div className="relative order-1 lg:order-none">
              <ImageInfoGroup
                images={anime.images}
                url={anime.url}
                trailer={anime.trailer}
                setIsTrailerModalOpen={setIsTrailerModalOpen}
              />
            </div>
          </div>

          <Tabs defaultValue="episodes">
            <TabsList className="w-full">
              <TabsTrigger value="episodes" className="cursor-pointer">
                <List /> Episodes
              </TabsTrigger>
              <TabsTrigger value="characters" className="cursor-pointer">
                <Users /> Characters
              </TabsTrigger>
            </TabsList>
            <TabsContent value="episodes">
              <AnimeEpisodesGroup id={id} />
            </TabsContent>
            <TabsContent value="characters">
              <AnimeCharactersGroup id={id} />
            </TabsContent>
          </Tabs>

          <TrailerModal
            trailer={anime.trailer}
            isOpen={isTrailerModalOpen}
            setIsOpen={setIsTrailerModalOpen}
          />
        </>
      )}
    </div>
  );
};

const PageSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_350px] gap-8 mb-12">
    <div className="lg:col-span-2 space-y-6 order-2 lg:order-none">
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

const AnimePrequelSequelGroup = ({
  relations,
  classname,
}: Pick<Anime, "relations"> & { classname?: string }) => {
  const router = useRouter();

  const prequel = relations?.find(
    (relation) => relation.relation === "Prequel"
  );
  const sequel = relations?.find((relation) => relation.relation === "Sequel");

  return (
    (prequel || sequel) && (
      <div
        className={twMerge(
          "gap-x-5 grid-cols-2 grid-rows-[auto_1fr]",
          classname
        )}
      >
        {prequel && (
          <div
            onClick={() =>
              router.replace(
                `/animes/${prequel.entry[0].mal_id}?name=${encodeURIComponent(
                  prequel.entry[0].name
                )}`
              )
            }
            className={`group items-center gap-x-2 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md font-inter hover:bg-card px-4 py-2 cursor-pointer row-span-2 grid grid-rows-subgrid grid-cols-[auto_1fr] ${
              !sequel && "col-span-2"
            }`}
          >
            <div className="row-span-2">
              <ChevronLeft />
            </div>
            <div className="grid grid-rows-subgrid row-span-2 items-center">
              <p className="font-inter text-muted-foreground text-sm">
                Prequel
              </p>
              <p className="font-inter group-hover:underline md:text-base text-sm truncate">
                {prequel.entry[0].name}
              </p>
            </div>
          </div>
        )}
        {sequel && (
          <div
            onClick={() =>
              router.replace(
                `/animes/${sequel.entry[0].mal_id}?name=${encodeURIComponent(
                  sequel.entry[0].name
                )}`
              )
            }
            className={`flex-1 group justify-end items-center gap-x-2 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md font-inter px-4 py-2 cursor-pointer row-span-2 grid grid-rows-subgrid grid-cols-[1fr_auto] ${
              !prequel && "col-span-2"
            }`}
          >
            <div className="grid grid-rows-subgrid row-span-2 items-center">
              <p className="font-inter text-muted-foreground text-sm text-right">
                Sequel
              </p>
              <p className="font-inter text-right group-hover:underline md:text-base text-sm truncate">
                {sequel.entry[0].name}
              </p>
            </div>
            <div className="row-span-2">
              <ChevronRight />
            </div>
          </div>
        )}
      </div>
    )
  );
};

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

const AnimeStatsBadges = ({ anime }: { anime: Anime }) => {
  const ratingTag = (
    <p className="text-xs font-inter px-2 py-1 rounded-full border font-medium">
      {anime.rating}
    </p>
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-1 py-1 px-2 rounded-full bg-secondary hover:bg-secondary/80">
        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        <p className="font-bold text-xs font-inter">{anime.score.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground font-inter">
          ({anime.scoredBy.toLocaleString()})
        </p>
      </div>

      {getRatingKey(anime.rating) ? (
        <Link href={`/animes/rating/${getRatingKey(anime.rating)}`}>
          {ratingTag}
        </Link>
      ) : (
        ratingTag
      )}

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
};

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
      cardDescription={anime.rank > 0 ? `#${anime.rank}` : "N/A"}
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

const ImageInfoGroup = ({
  images,
  url,
  trailer,
  setIsTrailerModalOpen,
}: Pick<Anime, "images" | "url" | "trailer"> & {
  setIsTrailerModalOpen: Dispatch<SetStateAction<boolean>>;
}) => (
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
      {trailer.youtube_id && (
        <div className="flex-1">
          <Button
            className="font-inter w-full dark:bg-input/30 dark:hover:bg-input/50 font-medium text-white cursor-pointer h-12 rounded-xl"
            onClick={() => setIsTrailerModalOpen(true)}
          >
            <Play />
            Watch Trailer
          </Button>
        </div>
      )}
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

const TrailerModal = ({
  trailer,
  setIsOpen,
  isOpen,
}: Pick<Anime, "trailer"> & {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          className="relative w-full sm:max-w-[760px] max-w-[90%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <X
            className="absolute right-1 top-1 h-5 w-5 text-gray-300 hover:text-white cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.youtube_id}?autoplay=1&enablejsapi=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AnimeDetailsPage;

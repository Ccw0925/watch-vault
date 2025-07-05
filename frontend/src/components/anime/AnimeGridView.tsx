import { Anime } from "@/types/anime";
import { Bookmark, Star } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import FeatureUnderDevelopmentDialog from "../FeatureUnderDevelopmentDialog";

type AnimeGridViewProps = Pick<
  Anime,
  | "id"
  | "title"
  | "score"
  | "scoredBy"
  | "rank"
  | "episodes"
  | "genres"
  | "status"
  | "images"
> & { gridContainerClassName?: string };

const ROTATION_RANGE = 16;
const HALF_ROTATION_RANGE = 16 / 2;

const AnimeGridView = ({
  id,
  title,
  score,
  scoredBy,
  rank,
  episodes,
  genres,
  status,
  images,
  gridContainerClassName,
}: AnimeGridViewProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rotationX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rotationY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rotationX);
    y.set(rotationY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className={twMerge(
        "h-[200px] lg:h-[350px] md:h-[300px] w-full lg:w-[550px] md:border md:rounded-2xl md:p-3 transform-3d lg:shadow-xl",
        gridContainerClassName
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
        className="rounded-2xl flex gap-4 h-full transform-3d"
        style={{ z: 30 }}
      >
        <ImageComponent
          imageUrl={images.webp.large_image_url}
          animeId={id}
          title={title}
        />

        <InfoComponent
          status={status}
          episodes={episodes}
          id={id}
          title={title}
          score={score}
          scoredBy={scoredBy}
          rank={rank}
          genres={genres}
        />
      </motion.div>
    </motion.div>
  );
};

export const AnimeSkeleton = () =>
  [...Array(5)].map((_, i) => (
    <div
      key={i}
      className="h-[200px] lg:h-[350px] md:h-[300px] w-full lg:w-[550px] lg:border rounded-2xl flex lg:p-3 gap-4"
    >
      <div className="lg:flex-4 rounded-2xl">
        <Skeleton className="lg:w-full h-full md:w-[200px] w-[150px]" />
      </div>
      <div className="flex-5 flex flex-col gap-5">
        <Skeleton className="lg:h-12 h-8 w-[50%]" />
        <Skeleton className="h-6 w-[35%]" />
        <Skeleton className="h-8 w-[80%] my-2" />
      </div>
    </div>
  ));

const ImageComponent = ({
  animeId,
  imageUrl,
  title,
}: {
  animeId: number;
  imageUrl: string;
  title: string;
}) => (
  <div className="rounded-2xl lg:relative overflow-hidden cursor-pointer transform-3d sticky top-0 aspect-[2/3]">
    <Link
      href={`/animes/${animeId}?name=${title}`}
      className="relative block h-full"
    >
      <Image
        src={imageUrl}
        alt={title ?? "Anime Cover"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        className="object-cover absolute"
      />
    </Link>
  </div>
);

const InfoComponent = ({
  status,
  episodes,
  id,
  title,
  score,
  scoredBy,
  rank,
  genres,
}: Pick<
  Anime,
  | "status"
  | "episodes"
  | "id"
  | "title"
  | "score"
  | "scoredBy"
  | "rank"
  | "genres"
>) => (
  <>
    <div className="flex-5 hidden gap-4 flex-col overflow-y-auto lg:overflow-visible lg:flex">
      <StatusRow status={status} />
      <EpisodesRow episodes={episodes} />
      <TitleRow id={id} title={title} />
      <RatingAndRankingRow score={score} scoredBy={scoredBy} rank={rank} />
      <GenresRow genres={genres} />
    </div>
    <div className="lg:hidden flex-5 flex flex-col gap-1 md:gap-2">
      <Link
        href={`/animes/${id}?name=${title}`}
        className="flex flex-col gap-1 md:gap-2 "
      >
        <StatusRow status={status} />
        <p className="font-inter font-bold line-clamp-1 md:line-clamp-2 md:text-lg">
          {title}
        </p>
        <p className="font-inter text-sm md:text-base">
          <span className="text-muted-foreground">Score: </span>
          <span className="font-semibold">
            {scoredBy <= 0 ? "--" : score}{" "}
            <span className="text-muted-foreground text-xs md:text-sm">
              ({scoredBy.toLocaleString()})
            </span>
          </span>
        </p>
        <p className="font-inter text-sm md:text-base">
          <span className="text-muted-foreground">Rank: </span>
          <span className="font-semibold">{`${rank > 0 ? rank : "N/A"}`}</span>
        </p>
        <p className="font-inter text-sm md:text-base md:hidden">
          <span className="text-muted-foreground">Status:</span>{" "}
          <span className="font-semibold">{status}</span>
        </p>
        <p className="font-inter text-sm md:text-base">
          <span className="text-muted-foreground">Episodes: </span>
          <span className="font-semibold">
            {episodes > 0 ? episodes : "N/A"}
          </span>
        </p>
        {genres.length > 0 && (
          <p className="font-inter text-sm md:hidden line-clamp-2">
            <span className="text-muted-foreground">Genres: </span>
            <span className="font-semibold text-xs">
              {genres
                .slice(0, 2)
                .map((genre) => genre.name)
                .join(", ")}{" "}
              {genres.length > 2 && " etc."}
            </span>
          </p>
        )}
      </Link>
      <GenresRow genres={genres} />
      <div className="flex-1 flex items-end md:items-start">
        <FeatureUnderDevelopmentDialog>
          <Button
            variant="outline"
            className="rounded-xl gap-1 md:h-10 h-8 cursor-pointer"
          >
            <Bookmark /> Save to Watchlist
          </Button>
        </FeatureUnderDevelopmentDialog>
      </div>
    </div>
  </>
);

const StatusRow = ({ status }: Pick<Anime, "status">) => {
  const statusStyling = {
    "Finished Airing": "dark:text-blue-300 text-blue-500",
    "Currently Airing": "dark:text-green-300 text-green-500",
    "Not yet aired": "dark:text-orange-300 text-orange-500",
  } as const;
  const styling =
    statusStyling[status as keyof typeof statusStyling] ||
    "dark:text-orange-300 text-orange-500";

  return (
    <div className="md:flex hidden lg:justify-between lg:gap-0">
      <p
        className={`font-inter p-2 rounded-xl font-semibold border-2 truncate ${styling}`}
      >
        {status}
      </p>

      <Tooltip>
        <TooltipTrigger>
          <FeatureUnderDevelopmentDialog>
            <div className="lg:flex hidden items-center p-2 border-2 rounded-xl cursor-pointer">
              <Bookmark />
            </div>
          </FeatureUnderDevelopmentDialog>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-inter text-white">Save to Watchlist</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

const EpisodesRow = ({ episodes }: Pick<Anime, "episodes">) => (
  <div>
    <p className="font-inter">{episodes > 0 ? episodes : "???"} episodes</p>
  </div>
);

const TitleRow = ({ id, title }: Pick<Anime, "id" | "title">) => (
  <div className="py-2">
    <Link href={`/animes/${id}?name=${title}`}>
      <p
        className="font-inter text-2xl font-bold line-clamp-2 cursor-pointer"
        title={title}
      >
        {title}
      </p>
    </Link>
  </div>
);

const RatingAndRankingRow = ({
  score,
  scoredBy,
  rank,
}: Pick<Anime, "score" | "scoredBy" | "rank">) => (
  <div className="flex gap-5">
    <div>
      <div className="flex gap-1 items-center">
        <Star />
        <p className="font-inter text-xl font-semibold">
          {scoredBy <= 0 ? "--" : score}
        </p>
      </div>
      <p className="font-inter font-semibold text-gray-400">
        {scoredBy.toLocaleString()} users
      </p>
    </div>
    <div>
      <p className="font-inter text-xl font-semibold">{`${
        rank > 0 ? `# ${rank}` : "N/A"
      }`}</p>
      <p className="font-inter font-semibold text-gray-400">Ranking</p>
    </div>
  </div>
);

const GenresRow = ({ genres }: Pick<Anime, "genres">) => (
  <div className="md:flex hidden flex-wrap gap-2">
    {genres.slice(0, 2).map((genre) => (
      <Link
        key={genre.mal_id}
        href={`/animes/genre/${genre.mal_id}?name=${genre.name}`}
      >
        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-xl cursor-pointer">
          <p className="font-inter font-semibold">{genre.name}</p>
        </div>
      </Link>
    ))}
    {genres.length > 2 && (
      <HoverCard>
        <HoverCardTrigger>
          <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-xl">
            <p className="font-inter font-semibold">+{genres.length - 2}</p>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-[200px]">
          <div className="flex gap-5 flex-wrap">
            {genres.slice(2).map((genre) => (
              <Link
                key={genre.mal_id}
                href={`/animes/genre/${genre.mal_id}?name=${genre.name}`}
              >
                <div
                  className={`bg-gray-200 dark:bg-gray-700 p-2 rounded-xl cursor-pointer max-h-[40px] ${
                    genres.length === 3 && "flex-1"
                  }`}
                >
                  <p className="font-inter font-semibold">{genre.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>
    )}
  </div>
);

export default AnimeGridView;

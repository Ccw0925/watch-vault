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
>;

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
      className="h-[350px] w-[550px] border rounded-2xl p-3 transform-3d shadow-xl"
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl flex gap-4 h-full transform-3d"
        style={{ transform: "translateZ(30px)" }}
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

const ImageComponent = ({
  animeId,
  imageUrl,
  title,
}: {
  animeId: number;
  imageUrl: string;
  title: string;
}) => (
  <div className="flex-4 rounded-2xl relative overflow-hidden cursor-pointer">
    <Link href={`/animes/${animeId}`}>
      <Image
        src={imageUrl}
        alt={title ?? "Anime Cover"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        className="object-cover"
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
  <div className="flex-5 flex gap-4 flex-col">
    <div className="flex justify-between">
      <p
        className={`font-inter p-2 rounded-xl font-semibold border-2 ${
          status === "Finished Airing"
            ? "dark:text-blue-300 text-blue-500"
            : "dark:text-orange-300 text-orange-500"
        }`}
      >
        {status}
      </p>

      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center p-2 border-2 rounded-xl cursor-pointer">
            <Bookmark />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-inter text-white">Save to Watchlist</p>
        </TooltipContent>
      </Tooltip>
    </div>

    <div>
      <p className="font-inter">{episodes > 0 ? episodes : "???"} episodes</p>
    </div>

    <div className="py-2">
      <Link href={`/animes/${id}`}>
        <p
          className="font-inter text-2xl font-bold line-clamp-2 cursor-pointer"
          title={title}
        >
          {title}
        </p>
      </Link>
    </div>

    <div className="flex gap-5">
      <div>
        <div className="flex gap-1 items-center">
          <Star />
          <p className="font-inter text-xl font-semibold">{score}</p>
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

    <div className="flex flex-wrap gap-2">
      {genres.slice(0, 2).map((genre) => (
        <div
          key={genre.mal_id}
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded-xl cursor-pointer"
        >
          <p className="font-inter font-semibold">{genre.name}</p>
        </div>
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
                <div
                  key={genre.mal_id}
                  className={`bg-gray-200 dark:bg-gray-700 p-2 rounded-xl cursor-pointer max-h-[40px] ${
                    genres.length === 3 && "flex-1"
                  }`}
                >
                  <p className="font-inter font-semibold">{genre.name}</p>
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  </div>
);

export default AnimeGridView;

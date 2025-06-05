import { Images } from "@/types/anime";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface AnimeGridViewProps {
  title: string;
  score: number;
  scoredBy: number;
  rank: number;
  episodes: number;
  images: Images;
  status: string;
}

const AnimeGridView = ({
  title,
  score,
  scoredBy,
  rank,
  episodes,
  images,
  status,
}: AnimeGridViewProps) => {
  return (
    <div className="h-[350px] w-[550px] border rounded-2xl flex p-3 gap-4 cursor-pointer">
      <div className="flex-4 rounded-2xl relative overflow-hidden">
        <Image
          src={images.webp.large_image_url}
          alt={title ?? "Anime Cover"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover"
        />
      </div>
      <div className="flex-5 flex gap-5 flex-col">
        <div className="flex">
          <p
            className={`font-inter p-2 rounded-xl font-semibold border-2 ${
              status === "Finished Airing" ? "text-blue-300" : "text-orange-300"
            }`}
          >
            {status}
          </p>
        </div>
        <div>
          <p className="font-inter">{episodes} episodes</p>
        </div>
        <div className="py-2">
          <p
            className="font-inter text-2xl font-bold line-clamp-2"
            title={title}
          >
            {title}
          </p>
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
        <div className="flex gap-2">
          <div className="bg-gray-700 p-2 rounded-xl">
            <p className="font-inter font-semibold">Drama</p>
          </div>
          <div className="bg-gray-700 p-2 rounded-xl">
            <p className="font-inter font-semibold">Sci-Fi</p>
          </div>
          <div className="bg-gray-700 p-2 rounded-xl">
            <p className="font-inter font-semibold">+1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeGridView;

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Anime } from "@/types/anime";
import { motion } from "motion/react";

type Props = {
  title: string;
  link: string;
  animes?: Anime[];
  isLoading: boolean;
};

const AnimesPreviewGroup = ({ title, link, animes, isLoading }: Props) => {
  return (
    <div className="font-inter">
      <Header title={title} link={link} />

      <div className="flex gap-5 overflow-x-auto scrollbar-hover pt-3 px-3 md:pb-3 overflow-y-hidden">
        {isLoading ? <ContentSkeleton /> : <Content animes={animes ?? []} />}
      </div>
    </div>
  );
};

const Header = ({ title, link }: Pick<Props, "title" | "link">) => (
  <div className="flex justify-between items-center pl-3">
    <Link href={link} className="flex hover:text-blue-500">
      <p className="text-xl font-bold">{title}</p>
    </Link>
    <Link href={link} className="flex hover:text-blue-500">
      <p>See All</p>
      <ChevronRight />
    </Link>
  </div>
);

const Content = ({ animes }: { animes: Anime[] }) =>
  animes.map(({ id, title, images, year }) => (
    <motion.div whileHover={{ scale: 1.05 }} key={id}>
      <Link
        href={`/animes/${id}?name=${title}`}
        className="flex flex-col gap-1 flex-shrink-0"
      >
        <div className="relative w-[216px] aspect-[2/3] rounded-2xl overflow-hidden bg-gray-800">
          <Image
            src={images.webp.large_image_url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div>
          <p className="text-center font-semibold max-w-[216px]">{title}</p>
          {year > 0 && (
            <p className="text-center text-sm text-muted-foreground">{year}</p>
          )}
        </div>
      </Link>
    </motion.div>
  ));

const ContentSkeleton = () => (
  <div className="flex gap-5 overflow-x-auto scrollbar-hover pb-3">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex flex-col gap-1 items-center">
        <Skeleton className="w-[216px] aspect-[2/3] rounded-2xl"></Skeleton>
        <Skeleton className="w-[45%] h-5"></Skeleton>
      </div>
    ))}
  </div>
);

export default AnimesPreviewGroup;

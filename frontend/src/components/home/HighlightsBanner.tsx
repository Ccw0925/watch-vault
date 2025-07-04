import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { TypographyH3 } from "../ui/typography";
import { useDeveloperRecomendations } from "@/hooks/api/animeHooks";
import { Skeleton } from "../ui/skeleton";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { Anime } from "@/types/anime";

const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  mass: 3,
  stiffness: 500,
  damping: 10,
};

const HighlightsBanner = () => {
  const { data: animes, isLoading } = useDeveloperRecomendations();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const dragX = useMotionValue(0);

  const images = [
    "/fullmetal-alchemist.jpg",
    "/steins-gate.jpg",
    "/attack-on-titans.jpg",
    "/diamond-no-ace.jpg",
    "/world-trigger.jpg",
    "/86.jpeg",
  ];

  const goPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [goNext, isHovered]);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && currentIndex < images.length - 1) {
      setCurrentIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && currentIndex > 0) {
      setCurrentIndex((pv) => pv - 1);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TypographyH3 className="text-center md:hidden block">
        Developer&apos;s Recommendations
      </TypographyH3>

      <div className="w-full h-[600px] md:block hidden relative rounded-b-3xl rounded-tr-3xl">
        <div
          className={`
            absolute bg-background py-3 px-5 rounded-br-3xl z-1 
            after:w-[30px] after:h-[30px] after:bg-transparent after:absolute after:rounded-tl-3xl after:top-0 after:right-[-30px] after:shadow-[-0.5rem_-0.5rem_var(--background)] 
            before:w-[30px] before:h-[30px] before:bg-transparent before:absolute before:bottom-[-30px] before:left-0 before:shadow-[-0.5rem_-0.5rem_var(--background)] before:rounded-tl-3xl
            md:block hidden
          `}
        >
          <TypographyH3>Developer&apos;s Recommendations</TypographyH3>
        </div>

        <div className="relative h-full w-full rounded-b-3xl rounded-tr-3xl overflow-hidden md:block hidden">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Link
                  href={`/animes/${animes?.[currentIndex].id}`}
                  className="block relative h-full w-full"
                >
                  <Image
                    src={images[currentIndex]}
                    alt={animes?.[currentIndex].title ?? "Anime Cover"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 85vw"
                    priority
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && animes && animes.length > 0 && (
            <div className="w-[500px] max-w-[50%] absolute bottom-0 left-0 font-inter rounded-3xl bg-clip-padding backdrop-filter text-white backdrop-blur-2xl bg-opacity-10 py-4 px-6 bg-gray-900/25">
              <p className="font-bold underline underline-offset-2 text-lg text-center">
                {animes[currentIndex].title}
              </p>
              <p className="text-justify mt-1 line-clamp-16">
                {animes[currentIndex].synopsis}
              </p>
            </div>
          )}

          {!isLoading && animes && animes.length > 0 && (
            <div className="gap-2 absolute bottom-2 left-[50%] p-2 lg:flex hidden">
              {animes.map((anime, index) => (
                <div
                  onClick={() => setCurrentIndex(index)}
                  key={index}
                  className={`w-10 h-2 rounded-full ${
                    currentIndex === index
                      ? "bg-white"
                      : "bg-white/25 cursor-pointer"
                  }`}
                />
              ))}
            </div>
          )}

          {!isLoading && animes && animes.length > 0 && (
            <div className="absolute bottom-5 right-5 flex gap-3">
              <div
                onClick={goPrevious}
                className="select-none hover:bg-white/70 hover:text-black cursor-pointer rounded-full bg-clip-padding backdrop-filter text-white backdrop-blur-2xl bg-opacity-10 p-4 bg-white/25"
              >
                <ChevronLeft />
              </div>
              <div
                onClick={goNext}
                className="select-none hover:bg-white/70 hover:text-black cursor-pointer rounded-full bg-clip-padding backdrop-filter text-white backdrop-blur-2xl bg-opacity-10 p-4 bg-white/25"
              >
                <ChevronRight />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE VIEW */}
      {isLoading ? (
        <Skeleton className="w-full h-[600px] md:hidden block rounded-3xl" />
      ) : (
        <div>
          <div className="relative md:hidden block rounded-3xl overflow-hidden mb-1">
            <motion.div
              drag="x"
              dragElastic={1}
              dragConstraints={{
                left: 0,
                right: 0,
              }}
              style={{
                x: dragX,
              }}
              animate={{
                translateX: `-${currentIndex * 100}%`,
              }}
              transition={SPRING_OPTIONS}
              onDragEnd={onDragEnd}
              className="flex cursor-grab active:cursor-grabbing"
            >
              <Images animes={animes ?? []} />
            </motion.div>
          </div>

          {!isLoading && animes && animes.length > 0 && (
            <div className="gap-2 bottom-2 left-[50%] p-2 md:hidden flex justify-center">
              {animes.map((anime, index) => (
                <div
                  onClick={() => setCurrentIndex(index)}
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentIndex === index
                      ? "bg-white"
                      : "bg-white/25 cursor-pointer"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Images = ({ animes }: { animes: Anime[] }) => {
  return animes.map((anime) => (
    <Link
      key={anime.id}
      href={`/animes/${anime.id}`}
      className="block relative shrink-0 w-full"
    >
      <Image
        src={anime.images.webp.large_image_url ?? ""}
        alt={anime.title ?? "Anime Cover"}
        height={600}
        width={400}
        className="object-cover"
        priority
      />

      <div className="absolute flex items-center gap-1 top-5 left-5 text-white font-inter bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 py-2 px-4 bg-gray-900/25 rounded-xl">
        <Star fill="yellow" className="text-yellow-200 h-4 w-4" />
        <p className="font-semibold">{anime.score.toFixed(2)}</p>
      </div>

      <div className="absolute w-full text-center bottom-0 text-white font-inter bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 py-3 px-2 bg-gray-900/25">
        <p className="font-bold">{anime.title}</p>
        <p>{animes && anime.year > 0 && anime.year}</p>
      </div>
    </Link>
  ));
};

export default HighlightsBanner;

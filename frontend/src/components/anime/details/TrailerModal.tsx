import { Anime } from "@/types/anime";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { Dispatch, SetStateAction, useEffect } from "react";

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

export default TrailerModal;

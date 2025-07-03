import React from "react";
import { TypographyH4 } from "./ui/typography";
import SideBarMenuItem from "./SideBarMenuItem";
import {
  Bird,
  Bookmark,
  Calendar,
  Clapperboard,
  House,
  Popcorn,
  Trophy,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { twMerge } from "tailwind-merge";

const SideBar = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge("w-[275px] h-full px-5 py-8", className)}>
      <div className="dark:bg-[#22262c] bg-gray-200 py-5 px-6 rounded-2xl">
        <TypographyH4 className="mb-5 text-center">Menu</TypographyH4>

        <div className="font-inter flex flex-col">
          <SideBarMenuItem icon={House} label="Home" />
          <SideBarMenuItem icon={Bookmark} label="My Watchlist" />

          <Separator className="my-4 bg-gray-500 dark:bg-border" />

          <p className="text-xl text-center font-bold mb-1">Animes</p>

          <SideBarMenuItem icon={Bird} label="All Animes" link="/animes" />
          <SideBarMenuItem
            icon={Trophy}
            label="Top Animes"
            link="/animes/top"
          />
          <SideBarMenuItem
            icon={Calendar}
            label="Seasonal"
            link="/animes/seasons/now"
          />

          <Separator className="my-4 bg-gray-500 dark:bg-border" />

          <SideBarMenuItem icon={Popcorn} label="Movies" link="/movies" />
          <SideBarMenuItem icon={Clapperboard} label="Series" />
        </div>
      </div>
    </div>
  );
};

export default SideBar;

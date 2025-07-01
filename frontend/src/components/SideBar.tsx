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

const SideBar = () => {
  return (
    <div className="w-[275px] h-full px-5 py-8">
      <div className="dark:bg-[#22262c] bg-gray-200 py-5 px-6 rounded-2xl">
        <TypographyH4 className="mb-5 text-center">Menu</TypographyH4>

        <div className="font-inter flex flex-col">
          <SideBarMenuItem icon={House} label="Home" />
          <SideBarMenuItem icon={Bookmark} label="Favorites" />

          <Separator className="my-4 bg-gray-500 dark:bg-border" />

          <p className="text-lg text-center font-bold underline underline-offset-2">Animes</p>

          <SideBarMenuItem icon={Bird} label="All Animes" link="/animes" />
          <SideBarMenuItem
            icon={Trophy}
            label="Top Animes"
            link="/animes/top"
          />
          <SideBarMenuItem
            icon={Calendar}
            label="Upcoming"
            link="/animes/upcoming"
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

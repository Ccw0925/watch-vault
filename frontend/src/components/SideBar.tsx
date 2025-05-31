import React from 'react'
import { TypographyH4 } from './ui/typography';
import SideBarMenuItem from './SideBarMenuItem';
import { Bird, Bookmark, Clapperboard, House, Popcorn } from "lucide-react";


const SideBar = () => {
  return (
    <div className="w-[275px] h-full px-5 py-8">
      <div className="dark:bg-[#22262c] bg-gray-200 py-5 px-6 rounded-2xl">
        <TypographyH4 className="mb-5 text-center">Menu</TypographyH4>

        <div className="font-inter flex flex-col gap-4">
          <SideBarMenuItem icon={Bookmark} label="Favorites" />
          <SideBarMenuItem icon={House} label="Home" />
          <SideBarMenuItem icon={Bird} label="Animes" />
          <SideBarMenuItem icon={Popcorn} label="Movies" />
          <SideBarMenuItem icon={Clapperboard} label="Series" />
        </div>
      </div>
    </div>
  );
}

export default SideBar
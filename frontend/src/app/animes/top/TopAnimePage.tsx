"use client";
import { SearchBar } from "@/components/anime/SearchBar";
import TopAnimeGridGroup from "@/components/anime/top/TopAnimeGridGroup";
import { TypographyH1 } from "@/components/ui/typography";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const TopAnimePage = () => {
  const animeType = useSearchParams().get("type") ?? "all";

  return (
    <div className="p-5 relative">
      <TypographyH1 className="text-center mb-5">Top Animes</TypographyH1>

      <div className="flex flex-col items-center mb-5">
        <SearchBar />
      </div>

      <Tabs value={animeType}>
        <CustomTab currentTab={animeType} />
        <TabsContent value="all">
          <TopAnimeGridGroup />
        </TabsContent>
        <TabsContent value="movies">
          <TopAnimeGridGroup type="movie" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CustomTab = ({ currentTab }: { currentTab: string }) => {
  return (
    <div className="bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-[3px] w-full">
      <CustomTabTrigger link="/animes/top" isSelected={currentTab === "all"}>
        All
      </CustomTabTrigger>
      <CustomTabTrigger
        link="/animes/top?type=movies"
        isSelected={currentTab === "movies"}
      >
        Movies
      </CustomTabTrigger>
    </div>
  );
};

const CustomTabTrigger = ({
  link,
  children,
  isSelected,
}: {
  link: string;
  children: React.ReactNode;
  isSelected?: boolean;
}) => {
  return (
    <Link
      href={link}
      className={`inline-flex h-full flex-1 items-center justify-center rounded-md focus-visible:outline-none ${
        isSelected ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <div
        className={`inline-flex h-[calc(100%-1px)] w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-sm font-medium whitespace-nowrap transition-all
      ${
        isSelected
          ? "bg-background text-foreground shadow-sm border-input dark:border-input dark:bg-input/30 dark:text-foreground"
          : "border-transparent text-foreground dark:text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }
      focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
    `}
        data-state={isSelected ? "active" : "inactive"}
      >
        {children}
      </div>
    </Link>
  );
};

export default TopAnimePage;

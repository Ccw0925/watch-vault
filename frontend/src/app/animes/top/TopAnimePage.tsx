"use client";
import { SearchBar } from "@/components/anime/SearchBar";
import TopAnimeGridGroup from "@/components/anime/top/TopAnimeGridGroup";
import { TypographyH1 } from "@/components/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const TopAnimePage = () => {
  return (
    <div className="p-5 relative">
      <TypographyH1 className="text-center mb-5">Top Animes</TypographyH1>

      <div className="flex flex-col items-center mb-5">
        <SearchBar />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="cursor-pointer">
            All
          </TabsTrigger>
          <TabsTrigger value="movies" className="cursor-pointer">
            Movies
          </TabsTrigger>
        </TabsList>
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

export default TopAnimePage;

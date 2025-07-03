import React from "react";
import AnimesPreviewGroup from "./AnimesPreviewGroup";
import { useTopAnimes } from "@/hooks/api/animeHooks";

const TopAnimesPreviewGroup = () => {
  const { data, isLoading } = useTopAnimes({ page: 1, limit: 13 });
  const animes = data?.data;

  return isLoading || (animes && animes.length > 0) ? (
    <AnimesPreviewGroup
      title="Top Animes"
      link="/animes/top"
      animes={animes}
      isLoading={isLoading}
    />
  ) : null;
};

export default TopAnimesPreviewGroup;

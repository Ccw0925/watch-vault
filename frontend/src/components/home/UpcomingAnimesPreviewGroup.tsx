import React from "react";
import AnimesPreviewGroup from "./AnimesPreviewGroup";
import { useUpcomingAnimes } from "@/hooks/api/animeHooks";

const UpcomingAnimesPreviewGroup = () => {
  const { data, isLoading } = useUpcomingAnimes({ page: 1, limit: 15 });
  const animes = data?.data;

  return isLoading || (animes && animes.length > 0) ? (
    <AnimesPreviewGroup
      title="Upcoming Animes"
      link="/animes/seasons/now"
      animes={animes}
      isLoading={isLoading}
    />
  ) : null;
};

export default UpcomingAnimesPreviewGroup;

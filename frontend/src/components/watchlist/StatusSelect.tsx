import { useUpdateWatchlistStatus } from "@/hooks/api/watchlistHooks";
import { ALL_STATUSES, StatusDisplayMap, WatchStatus } from "@/types/watchlist";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Anime } from "@/types/anime";

interface StatusSelectProps {
  animeId: number;
  currentStatus?: WatchStatus;
  currentProgress?: number;
}

const StatusSelect = ({
  animeId,
  currentStatus,
  currentProgress,
}: StatusSelectProps) => {
  const { mutate: updateStatus } = useUpdateWatchlistStatus();
  const queryClient = useQueryClient();

  const handleStatusChange = (newStatus: WatchStatus) => {
    updateStatus(
      {
        animeId,
        status: newStatus,
        progress:
          newStatus === WatchStatus.Watching ? currentProgress : undefined,
      },
      {
        onSuccess: (data, variables) => {
          queryClient.setQueryData(
            ["animes", String(variables.animeId)],
            (oldData: Anime) =>
              oldData
                ? {
                    ...oldData,
                    watchlistStatus: newStatus,
                    watchlistProgress:
                      newStatus === WatchStatus.Watching &&
                      currentProgress === undefined
                        ? 1
                        : currentProgress,
                  }
                : oldData
          );
        },
      }
    );
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => handleStatusChange(value as WatchStatus)}
    >
      <SelectTrigger className="w-full rounded-xl font-inter" size="lg">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {ALL_STATUSES.map((statusOption) => (
          <SelectItem
            key={statusOption}
            value={statusOption}
            className="font-inter cursor-pointer"
          >
            {StatusDisplayMap[statusOption]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;

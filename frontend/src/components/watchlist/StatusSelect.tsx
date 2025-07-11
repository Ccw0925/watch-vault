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

interface StatusSelectProps {
  animeId: number;
  currentStatus?: WatchStatus;
  currentProgress?: number;
  onChange: (newStatus: WatchStatus) => void;
}

const StatusSelect = ({
  animeId,
  currentStatus,
  currentProgress,
  onChange,
}: StatusSelectProps) => {
  const { mutate: updateStatus } = useUpdateWatchlistStatus();

  const handleStatusChange = (newStatus: WatchStatus) => {
    updateStatus(
      {
        animeId,
        status: newStatus,
        progress:
          newStatus === WatchStatus.Watching ? currentProgress : undefined,
      },
      {
        onSuccess: () => {
          onChange(newStatus);
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

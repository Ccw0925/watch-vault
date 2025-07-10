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
}

const StatusSelect = ({
  animeId,
  currentStatus,
  currentProgress,
}: StatusSelectProps) => {
  const { mutate: updateStatus } = useUpdateWatchlistStatus();

  const handleStatusChange = (newStatus: WatchStatus) => {
    updateStatus({
      animeId,
      status: newStatus,
      progress: currentProgress,
    });
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => handleStatusChange(value as WatchStatus)}
    >
      <SelectTrigger className="w-full rounded-xl">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {ALL_STATUSES.map((statusOption) => (
          <SelectItem key={statusOption} value={statusOption}>
            {StatusDisplayMap[statusOption]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;

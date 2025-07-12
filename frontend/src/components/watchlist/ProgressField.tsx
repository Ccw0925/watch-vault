import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUpdateWatchlistStatus } from "@/hooks/api/watchlistHooks";
import { WatchStatus } from "@/types/watchlist";

interface ProgressFieldProps {
  animeId: number;
  lastEpisode: number;
  currentProgress?: number;
  currentStatus?: WatchStatus;
  onSave: () => void;
}

const ProgressField = ({
  animeId,
  lastEpisode,
  currentProgress,
  currentStatus,
  onSave,
}: ProgressFieldProps) => {
  const { mutate: updateStatus } = useUpdateWatchlistStatus();
  const [progress, setProgress] = useState(currentProgress);
  const [error, setError] = useState<string | null>(null);

  const handleSave = (newProgress: number) => {
    if (lastEpisode && newProgress > lastEpisode) {
      setError(`Progress cannot exceed total episodes (${lastEpisode})`);
      return;
    }

    if (newProgress < 1) {
      setError("Progress must be at least 1");
      return;
    }

    setError(null);

    let newStatus = currentStatus ?? WatchStatus.Watching;

    if (lastEpisode && newProgress === lastEpisode) {
      newStatus = WatchStatus.FinishedWatching;
    }

    updateStatus(
      {
        animeId: animeId,
        status: newStatus,
        progress: newProgress,
      },
      {
        onSuccess: () => {
          onSave();
        },
      }
    );
  };

  return (
    <div>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          placeholder="Watch Until..."
          className="h-12 rounded-xl font-inter"
          type="number"
          defaultValue={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          max={lastEpisode ? lastEpisode : undefined}
          min={1}
        />
        <Button
          type="submit"
          variant="outline"
          className="rounded-xl h-12 font-inter cursor-pointer"
          onClick={() => handleSave(Number(progress))}
        >
          Save
        </Button>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-inter pl-2 pt-1">{error}</p>
      )}
    </div>
  );
};

export default ProgressField;

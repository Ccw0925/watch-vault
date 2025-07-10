import {
  useAddAnimeToWatchlist,
  useRemoveAnimeFromWatchlist,
} from "@/hooks/api/watchlistHooks";
import { Anime } from "@/types/anime";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = Pick<Anime, "id" | "inWatchlist"> & {
  variant?: "textBtn" | "iconBtn";
  disabled: boolean;
  onWatchlistChange?: (newStatus: boolean) => void;
};

const WatchlistButton = ({
  variant = "textBtn",
  id,
  inWatchlist,
  disabled,
  onWatchlistChange,
}: Props) => {
  const [optimisticInWatchlist, setOptimisticInWatchlist] =
    useState(inWatchlist);

  useEffect(() => {
    if (!disabled) {
      setOptimisticInWatchlist(inWatchlist);
    }
  }, [inWatchlist, disabled]);

  const addMutation = useAddAnimeToWatchlist();
  const removeMutation = useRemoveAnimeFromWatchlist();

  const rollback = (error: Error, newWatchlistStatus: boolean) => {
    setOptimisticInWatchlist(!newWatchlistStatus);
    toast.error("Error", {
      description: error.message,
    });
  };

  const handleWatchlistClick = () => {
    if (disabled) return;

    const newWatchlistStatus = !optimisticInWatchlist;
    setOptimisticInWatchlist(newWatchlistStatus);

    if (newWatchlistStatus) {
      addMutation.mutate(id, {
        onError: (error) => rollback(error, newWatchlistStatus),
        onSuccess: () => {
          if (onWatchlistChange) onWatchlistChange(newWatchlistStatus);
        },
      });
    } else {
      removeMutation.mutate(id, {
        onError: (error) => rollback(error, newWatchlistStatus),
        onSuccess: () => {
          if (onWatchlistChange) onWatchlistChange(newWatchlistStatus);
        },
      });
    }
  };

  const isMutating = addMutation.isPending || removeMutation.isPending;

  return variant === "textBtn" ? (
    <Button
      variant="outline"
      className="group cursor-pointer font-inter"
      disabled={disabled || isMutating}
      onClick={handleWatchlistClick}
    >
      <Bookmark
        className={
          optimisticInWatchlist
            ? "group-hover:fill-none fill-white"
            : "group-hover:fill-white fill-none"
        }
      />
      {optimisticInWatchlist ? "Saved" : "Add to Watchlist"}
    </Button>
  ) : (
    <Tooltip>
      <TooltipTrigger>
        <div
          onClick={handleWatchlistClick}
          className={`group lg:flex hidden items-center p-2 border-2 rounded-xl ${
            disabled || isMutating
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100 cursor-pointer"
          }`}
        >
          <Bookmark
            className={
              optimisticInWatchlist
                ? "group-hover:fill-none fill-white"
                : "group-hover:fill-white fill-none"
            }
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-inter text-white">
          {optimisticInWatchlist
            ? "Remove from Watchlist"
            : "Save to Watchlist"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default WatchlistButton;

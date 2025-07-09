import { Anime } from "./anime";

export type MutationResponse = {
  success: boolean;
};

export enum WatchStatus {
  PlanToWatch = "PLAN_TO_WATCH",
  Watching = "WATCHING",
  FinishedWatching = "FINISHED_WATCHING",
}

export const ALL_STATUSES = [
  WatchStatus.PlanToWatch,
  WatchStatus.Watching,
  WatchStatus.FinishedWatching,
];

export const StatusDisplayMap: Record<WatchStatus, string> = {
  [WatchStatus.PlanToWatch]: "Plan to Watch",
  [WatchStatus.Watching]: "Currently Watching",
  [WatchStatus.FinishedWatching]: "Finished",
};

export type WatchlistItem = {
  anime: Anime;
  status?: WatchStatus;
  progress?: number;
};

export type WatchlistResponse = WatchlistItem[];

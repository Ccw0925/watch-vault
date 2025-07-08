package watchlist

type WatchStatus string

const (
	PlanToWatch      WatchStatus = "PLAN_TO_WATCH"
	Watching         WatchStatus = "WATCHING"
	FinishedWatching WatchStatus = "FINISHED_WATCHING"
)

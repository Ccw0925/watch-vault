package watchlist

type WatchStatus string

const (
	PlanToWatch      WatchStatus = "PLAN_TO_WATCH"
	Watching         WatchStatus = "WATCHING"
	FinishedWatching WatchStatus = "FINISHED_WATCHING"
)

type WatchlistItem struct {
	Status   *WatchStatus `json:"status" firestore:"status"`
	Progress *int         `json:"progress" firestore:"progress"`
}

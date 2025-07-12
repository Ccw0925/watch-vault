package watchlist

type WatchStatus int

const (
	PlanToWatch WatchStatus = iota
	Watching
	FinishedWatching
)

type ReadableWatchStatus string

const (
	PlanToWatchString      ReadableWatchStatus = "PLAN_TO_WATCH"
	WatchingString         ReadableWatchStatus = "WATCHING"
	FinishedWatchingString ReadableWatchStatus = "FINISHED_WATCHING"
)

func (ws WatchStatus) ToReadable() ReadableWatchStatus {
	switch ws {
	case PlanToWatch:
		return PlanToWatchString
	case Watching:
		return WatchingString
	case FinishedWatching:
		return FinishedWatchingString
	default:
		return ""
	}
}

func (rws ReadableWatchStatus) ToWatchStatus() WatchStatus {
	switch rws {
	case PlanToWatchString:
		return PlanToWatch
	case WatchingString:
		return Watching
	case FinishedWatchingString:
		return FinishedWatching
	default:
		return -1
	}
}

func IsValid(rws ReadableWatchStatus) bool {
	return rws == PlanToWatchString || rws == WatchingString || rws == FinishedWatchingString
}

type WatchlistItem struct {
	Status   *WatchStatus `json:"status" firestore:"status"`
	Progress *int         `json:"progress" firestore:"progress"`
}

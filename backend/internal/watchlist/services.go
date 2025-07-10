package watchlist

import (
	"context"
	"fmt"
	"slices"
	"time"

	"cloud.google.com/go/firestore"
	animeService "github.com/Ccw0925/watch-vault/internal/anime"
	"github.com/Ccw0925/watch-vault/internal/jikan"
	"github.com/patrickmn/go-cache"
)

var c = cache.New(5*time.Minute, 10*time.Minute)

type WatchlistService struct {
	repo        *WatchlistRepository
	jikanClient *jikan.Client
}

func NewWatchlistService(client *firestore.Client) *WatchlistService {
	return &WatchlistService{
		repo:        NewWatchlistRepository(client),
		jikanClient: jikan.NewClient(),
	}
}

func (s *WatchlistService) GetGuestWatchlist(ctx context.Context, guestId string, showIdsOnly bool) (interface{}, error) {
	cacheKey := fmt.Sprintf("watchlist_%s", guestId)

	if cached, found := c.Get(cacheKey); found {
		watchlist := cached.([]map[string]interface{})

		if showIdsOnly {
			idsList := make([]int, 0, len(watchlist))
			for _, item := range watchlist {
				if anime, ok := item["anime"].(map[string]interface{}); ok {
					if malID, ok := anime["id"].(int64); ok {
						idsList = append(idsList, int(malID))
					}
				}
			}
			return idsList, nil
		}

		return watchlist, nil
	}

	watchlist, err := s.repo.GetAll(ctx, guestId)
	if err != nil {
		return nil, err
	}

	slices.SortFunc(watchlist, func(a, b map[string]interface{}) int {
		aStatusStr, aOk := a["status"].(string)
		bStatusStr, bOk := b["status"].(string)

		if !aOk {
			if !bOk {
				return 0
			}
			return 1
		}
		if !bOk {
			return -1
		}

		aStatus := WatchStatus(aStatusStr)
		bStatus := WatchStatus(bStatusStr)

		priority := map[WatchStatus]int{
			PlanToWatch:      1,
			Watching:         2,
			FinishedWatching: 3,
		}

		aPriority := priority[aStatus]
		bPriority := priority[bStatus]

		if aPriority < bPriority {
			return -1
		}
		if aPriority > bPriority {
			return 1
		}
		return 0
	})

	c.SetDefault(cacheKey, watchlist)

	if showIdsOnly {
		idsList := make([]int, 0, len(watchlist))
		for _, item := range watchlist {
			if anime, ok := item["anime"].(map[string]interface{}); ok {
				if malID, ok := anime["id"].(int64); ok {
					idsList = append(idsList, int(malID))
				}
			}
		}
		return idsList, nil
	}

	return watchlist, nil
}

func (s *WatchlistService) GetAnimeById(ctx context.Context, guestId string, animeId int) (interface{}, error) {
	anime, err := s.repo.GetAnimeById(ctx, guestId, animeId)

	if err != nil {
		return nil, err
	}

	if anime == nil {
		return map[string]interface{}{}, nil
	}

	return anime, nil
}

func (s *WatchlistService) AddAnimeToWatchlist(ctx context.Context, guestId string, animeId int) error {
	anime, err := s.jikanClient.GetAnimeById(ctx, animeId)
	if err != nil {
		return err
	}

	err = animeService.AddAnimeAsMap(&anime.Data, ctx, s.repo.client)
	if err != nil {
		return err
	}

	cacheKey := fmt.Sprintf("watchlist_%s", guestId)
	c.Delete(cacheKey)

	return s.repo.AddAnimeToWatchlist(ctx, guestId, animeId)
}

func (s *WatchlistService) RemoveAnimeFromWatchlist(ctx context.Context, guestId string, animeId int) error {
	cacheKey := fmt.Sprintf("watchlist_%s", guestId)
	c.Delete(cacheKey)

	return s.repo.RemoveAnimeFromWatchlist(ctx, guestId, animeId)
}

func (s *WatchlistService) UpdateAnimeStatus(ctx context.Context, guestId string, animeId int, updateData map[string]interface{}) error {
	cacheKey := fmt.Sprintf("watchlist_%s", guestId)
	c.Delete(cacheKey)

	return s.repo.UpdateAnimeStatus(ctx, guestId, animeId, updateData)
}

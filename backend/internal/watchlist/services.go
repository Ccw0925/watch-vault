package watchlist

import (
	"context"
	"fmt"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/patrickmn/go-cache"
)

var c = cache.New(5*time.Minute, 10*time.Minute)

type WatchlistService struct {
	repo *WatchlistRepository
}

func NewWatchlistService(client *firestore.Client) *WatchlistService {
	return &WatchlistService{
		repo: NewWatchlistRepository(client),
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
					if malID, ok := anime["mal_id"].(float64); ok {
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

	c.SetDefault(cacheKey, watchlist)

	if showIdsOnly {
		idsList := make([]int, 0, len(watchlist))
		for _, item := range watchlist {
			if anime, ok := item["anime"].(map[string]interface{}); ok {
				if malID, ok := anime["mal_id"].(float64); ok {
					idsList = append(idsList, int(malID))
				}
			}
		}
		return idsList, nil
	}

	return watchlist, nil
}

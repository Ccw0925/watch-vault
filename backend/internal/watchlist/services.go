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

func (s *WatchlistService) GetGuestWatchlist(ctx context.Context, guestId string) ([]map[string]interface{}, error) {
	cacheKey := fmt.Sprintf("watchlist_%s", guestId)

	if cached, found := c.Get(cacheKey); found {
		return cached.([]map[string]interface{}), nil
	}

	watchlist, err := s.repo.GetAll(ctx, guestId)
	if err != nil {
		return nil, err
	}

	c.SetDefault(cacheKey, watchlist)
	return watchlist, nil
}

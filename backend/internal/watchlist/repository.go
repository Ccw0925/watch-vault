package watchlist

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

type WatchlistRepository struct {
	client *firestore.Client
}

func NewWatchlistRepository(client *firestore.Client) *WatchlistRepository {
	return &WatchlistRepository{client: client}
}

func (w *WatchlistRepository) GetAll(ctx context.Context, guestId string) ([]map[string]interface{}, error) {
	var watchlist []map[string]interface{}

	iter := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("error iterating watchlist: %v", err)
		}

		data := doc.Data()
		item := make(map[string]interface{})

		for k, v := range data {
			item[k] = v
		}

		if ref, ok := data["animeRef"].(*firestore.DocumentRef); ok {
			animeDoc, err := ref.Get(ctx)
			if err != nil {
				log.Printf("Warning: could not fetch anime %s: %v", ref.ID, err)
				continue
			}
			item["anime"] = animeDoc.Data()
		}

		delete(item, "animeRef")
		watchlist = append(watchlist, item)
	}

	return watchlist, nil
}

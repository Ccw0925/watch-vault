package watchlist

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const DefaultPageSize = 25

type WatchlistRepository struct {
	client *firestore.Client
}

func NewWatchlistRepository(client *firestore.Client) *WatchlistRepository {
	return &WatchlistRepository{client: client}
}

func (w *WatchlistRepository) GetAll(ctx context.Context, guestId string) ([]map[string]interface{}, error) {
	var watchlist []map[string]interface{}

	iter := w.client.Collection("guests").Doc(guestId).Collection("watchlist").OrderBy("status", firestore.Asc).Documents(ctx)
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
			if k == "status" {
				if watchStatus, ok := v.(int64); ok {
					item[k] = WatchStatus(watchStatus).ToReadable()
					continue
				}
			}
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

func (w *WatchlistRepository) GetPaginatedAll(ctx context.Context, guestId string, pageSize int, cursor string, status WatchStatus) ([]map[string]interface{}, string, bool, error) {
	if pageSize <= 0 {
		pageSize = DefaultPageSize
	}

	var watchlist []map[string]interface{}
	query := w.client.Collection("guests").Doc(guestId).Collection("watchlist").
		OrderBy("status", firestore.Asc).
		OrderBy(firestore.DocumentID, firestore.Desc).
		Limit(pageSize + 1)

	if status != -1 {
		query = query.Where("status", "==", int64(status))
	}

	if cursor != "" {
		lastDoc, err := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Doc(cursor).Get(ctx)
		if err != nil {
			return nil, "", false, fmt.Errorf("invalid cursor: %v", err)
		}
		query = query.StartAfter(lastDoc.Data()["status"], cursor)
	}

	iter := query.Documents(ctx)
	var lastDocID string

	for i := 0; i < pageSize; i++ {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, "", false, fmt.Errorf("error iterating watchlist: %v", err)
		}

		data := doc.Data()
		item := make(map[string]interface{})

		for k, v := range data {
			if k == "status" {
				if watchStatus, ok := v.(int64); ok {
					item[k] = WatchStatus(watchStatus).ToReadable()
					continue
				}
			}
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
		lastDocID = doc.Ref.ID
	}

	_, err := iter.Next()
	hasMore := err == nil

	return watchlist, lastDocID, hasMore, nil
}

func (w *WatchlistRepository) GetAnimeById(ctx context.Context, guestId string, animeId int) (map[string]interface{}, error) {
	doc, err := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Doc(fmt.Sprintf("%d", animeId)).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, nil
		}
		return nil, err
	}

	anime := doc.Data()
	return anime, nil
}

func (w *WatchlistRepository) AddAnimeToWatchlist(ctx context.Context, guestId string, animeId int) error {
	_, err := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Doc(fmt.Sprintf("%d", animeId)).Set(ctx, map[string]interface{}{
		"status":   PlanToWatch,
		"animeRef": w.client.Collection("animes").Doc(fmt.Sprintf("%d", animeId)),
	})
	return err
}

func (w *WatchlistRepository) RemoveAnimeFromWatchlist(ctx context.Context, guestId string, animeId int) error {
	_, err := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Doc(fmt.Sprintf("%d", animeId)).Delete(ctx)
	return err
}

func (w *WatchlistRepository) UpdateAnimeStatus(ctx context.Context, guestId string, animeId int, updateData map[string]interface{}) error {
	_, err := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Doc(fmt.Sprintf("%d", animeId)).Set(ctx, updateData, firestore.MergeAll)
	return err
}

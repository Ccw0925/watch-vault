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

func (w *WatchlistRepository) GetPaginatedAll(ctx context.Context, guestId string, pageSize int, startCursor string, endCursor string, direction string, status WatchStatus) ([]map[string]interface{}, string, string, bool, bool, error) {
	if pageSize <= 0 {
		pageSize = DefaultPageSize
	}

	baseQuery := w.client.Collection("guests").Doc(guestId).Collection("watchlist").
		OrderBy("status", firestore.Asc).
		OrderBy(firestore.DocumentID, firestore.Desc)

	if status != -1 {
		baseQuery = baseQuery.Where("status", "==", int64(status))
	}

	var query firestore.Query
	var hasMore, hasPrevious bool
	var firstDocID, lastDocID string

	switch direction {
	case "next":
		query = baseQuery.Limit(pageSize + 1)
		if startCursor != "" {
			cursorDoc, err := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Doc(startCursor).Get(ctx)
			if err != nil {
				return nil, "", "", false, false, fmt.Errorf("invalid start cursor: %v", err)
			}
			cursorStatus := cursorDoc.Data()["status"]
			query = query.StartAfter(cursorStatus, startCursor)
		}

	case "prev":
		reverseQuery := w.client.Collection("guests").Doc(guestId).Collection("watchlist").
			OrderBy("status", firestore.Desc).
			OrderBy(firestore.DocumentID, firestore.Asc)

		if status != -1 {
			reverseQuery = reverseQuery.Where("status", "==", int64(status))
		}

		query = reverseQuery.Limit(pageSize + 1)
		if endCursor != "" {
			cursorDoc, err := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Doc(endCursor).Get(ctx)
			if err != nil {
				return nil, "", "", false, false, fmt.Errorf("invalid end cursor: %v", err)
			}
			cursorStatus := cursorDoc.Data()["status"]
			query = query.StartAfter(cursorStatus, endCursor)
		}
	default:
		query = baseQuery.Limit(pageSize + 1)
	}

	iter := query.Documents(ctx)
	var docs []*firestore.DocumentSnapshot

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, "", "", false, false, fmt.Errorf("error iterating watchlist: %v", err)
		}
		docs = append(docs, doc)
	}

	if direction == "prev" {
		for i, j := 0, len(docs)-1; i < j; i, j = i+1, j-1 {
			docs[i], docs[j] = docs[j], docs[i]
		}
	}

	limit := pageSize
	if len(docs) > limit {
		if direction != "prev" {
			hasMore = true
			docs = docs[:limit]
		} else {
			hasPrevious = true
			docs = docs[len(docs)-limit:]
		}
	}

	var watchlist []map[string]interface{}
	for i, doc := range docs {
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

		if i == 0 {
			firstDocID = doc.Ref.ID
		}
		lastDocID = doc.Ref.ID
	}

	if direction != "prev" && firstDocID != "" {
		prevCheckDoc, err := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Doc(firstDocID).Get(ctx)
		if err != nil {
			return nil, "", "", false, false, fmt.Errorf("error checking previous page: %v", err)
		}
		prevCheckStatus := prevCheckDoc.Data()["status"]

		prevCheckQuery := baseQuery.
			EndBefore(prevCheckStatus, firstDocID).
			Limit(1)

		prevIter := prevCheckQuery.Documents(ctx)
		_, err = prevIter.Next()
		hasPrevious = err == nil
	}

	if direction == "prev" && lastDocID != "" {
		nextCheckDoc, err := w.client.Collection("guests").Doc(guestId).Collection("watchlist").Doc(lastDocID).Get(ctx)
		if err != nil {
			return nil, "", "", false, false, fmt.Errorf("error checking next page: %v", err)
		}
		nextCheckStatus := nextCheckDoc.Data()["status"]

		nextCheckQuery := baseQuery.
			StartAfter(nextCheckStatus, lastDocID).
			Limit(1)

		nextIter := nextCheckQuery.Documents(ctx)
		_, err = nextIter.Next()
		hasMore = err == nil
	}

	return watchlist, firstDocID, lastDocID, hasMore, hasPrevious, nil
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

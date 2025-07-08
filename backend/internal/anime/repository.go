package anime

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/Ccw0925/watch-vault/internal/jikan"
)

func AddAnimeAsMap(anime *jikan.Anime, ctx context.Context, firestoreClient *firestore.Client) error {
	_, err := firestoreClient.Collection("animes").Doc(fmt.Sprintf("%d", anime.ID)).Set(ctx, AnimeToResponse(anime))
	if err != nil {
		log.Printf("An error has occurred: %s", err)
	}

	return err
}

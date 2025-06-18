package routes

import (
	"context"

	"cloud.google.com/go/firestore"
	"github.com/Ccw0925/watch-vault/internal/jikan"
	"github.com/gin-gonic/gin"

	_ "github.com/mattn/go-sqlite3"

	"github.com/gin-contrib/cors"
)

func SetupRoutes(client *firestore.Client, ctx context.Context) *gin.Engine {
	// Initialize Gin router
	r := gin.Default()
	r.Use(cors.Default())

	// Setup static file server for images
	r.Static("/uploads", "./uploads")

	jikanClient := jikan.NewClient()

	RegisterAnimeRoutes(r, jikanClient)
	RegisterMovieRoutes(r, client, ctx)

	return r
}

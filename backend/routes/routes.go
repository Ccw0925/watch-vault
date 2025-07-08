package routes

import (
	"context"
	"os"

	"cloud.google.com/go/firestore"
	"github.com/Ccw0925/watch-vault/internal/jikan"
	"github.com/gin-gonic/gin"

	_ "github.com/mattn/go-sqlite3"

	"github.com/gin-contrib/cors"
)

func SetupRoutes(firestoreClient *firestore.Client, ctx context.Context) *gin.Engine {
	// Initialize Gin router
	if os.Getenv("DEBUG") == "true" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()
	r.Use(cors.Default())

	// Setup static file server for images
	r.Static("/uploads", "./uploads")

	jikanClient := jikan.NewClient()

	r.GET("", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	RegisterAnimeRoutes(r, jikanClient, firestoreClient)
	RegisterMovieRoutes(r, firestoreClient)
	RegisterWatchlistRoutes(r, firestoreClient)

	return r
}

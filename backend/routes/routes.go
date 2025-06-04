package routes

import (
	"database/sql"

	"github.com/Ccw0925/watch-vault/internal/jikan"
	"github.com/gin-gonic/gin"

	_ "github.com/mattn/go-sqlite3"

	"github.com/gin-contrib/cors"
)

func SetupRoutes(db *sql.DB) *gin.Engine {
	// Initialize Gin router
	r := gin.Default()
	r.Use(cors.Default())

	// Setup static file server for images
	r.Static("/uploads", "./uploads")

	jikanClient := jikan.NewClient()
	RegisterAnimeRoutes(r, jikanClient)

	RegisterMovieRoutes(r, db)

	return r
}

package routes

import (
	"database/sql"
	"net/http"

	"github.com/Ccw0925/movie-watchlist/internal/movie"
	"github.com/gin-gonic/gin"

	_ "github.com/mattn/go-sqlite3"

	"github.com/gin-contrib/cors"
)

func SetupRoutes(db *sql.DB) *gin.Engine {
	// Initialize Gin router
	r := gin.Default()
	r.Use(cors.Default())

	// List movies
	r.GET("/movies", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, title, year, watched FROM movies")
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		movies := []movie.Movie{}

		for rows.Next() {
			var movie movie.Movie
			err := rows.Scan(&movie.ID, &movie.Title, &movie.Year, &movie.Watched)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}

			movies = append(movies, movie)
		}

		c.JSON(http.StatusOK, movies)
	})

	// Create movie
	r.POST("/movies", func(c *gin.Context) {
		var newMovie movie.Movie
		if err := c.ShouldBindJSON(&newMovie); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		result, err := db.Exec("INSERT INTO movies (title, year, watched) VALUES (?, ?, ?)", newMovie.Title, newMovie.Year, newMovie.Watched)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		id, err := result.LastInsertId()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		newMovie.ID = int(id)
		c.JSON(http.StatusCreated, newMovie)
	})

	return r
}

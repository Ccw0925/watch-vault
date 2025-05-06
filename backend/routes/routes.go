package routes

import (
	"database/sql"
	"net/http"

	"github.com/Ccw0925/watch-vault/internal/movie"
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

	// Get movie by id
	r.GET("/movies/:id", func(c *gin.Context) {
		id := c.Param("id")

		var movie movie.Movie
		err := db.QueryRow("SELECT id, title, year, watched FROM movies WHERE id = ?", id).Scan(&movie.ID, &movie.Title, &movie.Year, &movie.Watched)

		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "movie not found"})
				return
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}

		c.JSON(http.StatusOK, movie)
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

	// Edit movie by id
	r.PATCH("/movies/:id", func(c *gin.Context) {
		id := c.Param("id")

		var updatedMovie movie.Movie
		if err := c.ShouldBindJSON(&updatedMovie); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		result, err := db.Exec("UPDATE movies SET title = ?, year = ?, watched = ? WHERE id = ?", updatedMovie.Title, updatedMovie.Year, updatedMovie.Watched, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check update result"})
			return
		}

		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
			return
		}

		var movieFromDB movie.Movie
		err = db.QueryRow("SELECT id, title, year, watched FROM movies WHERE id = ?", id).Scan(
			&movieFromDB.ID, &movieFromDB.Title, &movieFromDB.Year, &movieFromDB.Watched,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve updated movie"})
			return
		}

		c.JSON(http.StatusOK, movieFromDB)
	})

	// Delete movie
	r.DELETE("/movies/:id", func(c *gin.Context) {
		id := c.Param("id")
		_, err := db.Exec("DELETE FROM movies WHERE id = ?", id)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.Status(http.StatusNoContent)
	})

	return r
}

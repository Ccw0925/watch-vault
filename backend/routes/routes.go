package routes

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/Ccw0925/watch-vault/internal/movie"
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

	// List movies
	r.GET("/movies", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, title, year, watched, image_path FROM movies")
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		movies := []gin.H{}

		for rows.Next() {
			var movie movie.Movie
			err := rows.Scan(&movie.ID, &movie.Title, &movie.Year, &movie.Watched, &movie.ImagePathObject)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}

			if movie.ImagePathObject.Valid {
				movie.ImagePath = movie.ImagePathObject.String
			}

			movies = append(movies, gin.H{
				"id":        movie.ID,
				"title":     movie.Title,
				"year":      movie.Year,
				"watched":   movie.Watched,
				"imagePath": movie.ImagePath,
			})
		}

		c.JSON(http.StatusOK, movies)
	})

	// Get movie by id
	r.GET("/movies/:id", func(c *gin.Context) {
		id := c.Param("id")

		var movie movie.Movie
		err := db.QueryRow("SELECT id, title, year, watched, image_path FROM movies WHERE id = ?", id).Scan(&movie.ID, &movie.Title, &movie.Year, &movie.Watched, &movie.ImagePathObject)

		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "movie not found"})
				return
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}

		if movie.ImagePathObject.Valid {
			movie.ImagePath = movie.ImagePathObject.String
		}

		c.JSON(http.StatusOK, gin.H{
			"id":        movie.ID,
			"title":     movie.Title,
			"year":      movie.Year,
			"watched":   movie.Watched,
			"imagePath": movie.ImagePath,
		})
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
		err = db.QueryRow("SELECT id, title, year, watched, image_path FROM movies WHERE id = ?", id).Scan(
			&movieFromDB.ID, &movieFromDB.Title, &movieFromDB.Year, &movieFromDB.Watched, &movieFromDB.ImagePathObject,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve updated movie"})
			return
		}

		if movieFromDB.ImagePathObject.Valid {
			movieFromDB.ImagePath = movieFromDB.ImagePathObject.String
		}

		c.JSON(http.StatusOK, gin.H{
			"id":        movieFromDB.ID,
			"title":     movieFromDB.Title,
			"year":      movieFromDB.Year,
			"watched":   movieFromDB.Watched,
			"imagePath": movieFromDB.ImagePath,
		})
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

	// Image upload for movie
	r.POST("/movies/:id/image", func(c *gin.Context) {
		// Verify movie exists first
		id := c.Param("id")
		var movieID int
		err := db.QueryRow("SELECT id FROM movies WHERE id = ?", id).Scan(&movieID)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}

		// Parse multipart form
		if err := c.Request.ParseMultipartForm(10 << 20); err != nil { // 10 MB max
			c.JSON(http.StatusBadRequest, gin.H{"error": "File too large"})
			return
		}

		file, header, err := c.Request.FormFile("image")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required"})
			return
		}
		defer file.Close()

		// Create uploads directory if it doesn't exist
		if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create upload directory"})
			return
		}

		// Generate unique filename
		ext := filepath.Ext(header.Filename)
		imageName := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
		imagePath := filepath.Join("uploads", imageName)

		// Create the file
		out, err := os.Create(imagePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create file"})
			return
		}
		defer out.Close()

		// Copy the file
		if _, err := io.Copy(out, file); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save file"})
			return
		}

		// Update movie with image path
		_, err = db.Exec("UPDATE movies SET image_path = ? WHERE id = ?", imagePath, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":   "Image uploaded successfully",
			"imagePath": imagePath,
		})
	})

	return r
}

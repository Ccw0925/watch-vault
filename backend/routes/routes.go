package routes

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
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
		limit := c.DefaultQuery("limit", "10")
		offset := c.DefaultQuery("offset", "0")

		limitInt, err := strconv.Atoi(limit)
		if err != nil || limitInt <= 0 {
			limitInt = 10
		}

		offsetInt, err := strconv.Atoi(offset)
		if err != nil || offsetInt < 0 {
			offsetInt = 0
		}

		var totalCount int
		err = db.QueryRow("SELECT COUNT(*) FROM movies").Scan(&totalCount)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		query := "SELECT id, title, year, watched, image_path FROM movies LIMIT ? OFFSET ?"
		rows, err := db.Query(query, limitInt, offsetInt)
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
				return
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

		response := gin.H{
			"data":   movies,
			"total":  totalCount,
			"limit":  limitInt,
			"offset": offsetInt,
		}

		if offsetInt+limitInt < totalCount {
			nextValues := c.Request.URL.Query()
			nextValues.Set("offset", strconv.Itoa(offsetInt+limitInt))
			response["next"] = c.Request.URL.Path + "?" + nextValues.Encode() + "&limit=" + limit
		}

		if offsetInt > 0 {
			prevValues := c.Request.URL.Query()
			prevValues.Set("offset", strconv.Itoa(max(0, offsetInt-limitInt)))
			response["prev"] = c.Request.URL.Path + "?" + prevValues.Encode() + "&limit=" + limit
		}

		c.JSON(http.StatusOK, response)
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
		var input struct {
			Title    string `json:"title" binding:"required"`
			Year     int    `json:"year" binding:"required"`
			Watched  bool   `json:"watched"`
			ImageUrl string `json:"imageUrl"` // Optional
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// First insert the movie without the image
		result, err := db.Exec("INSERT INTO movies (title, year, watched) VALUES (?, ?, ?)",
			input.Title, input.Year, input.Watched)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		id, err := result.LastInsertId()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		response := gin.H{
			"id":      id,
			"title":   input.Title,
			"year":    input.Year,
			"watched": input.Watched,
		}

		// Handle image URL if provided
		if input.ImageUrl != "" {
			imagePath, err := handleImageUpload(id, input.ImageUrl)
			if err != nil {
				response["imageError"] = err.Error()
			} else if imagePath != "" {
				// Update the movie with the image path
				_, err = db.Exec("UPDATE movies SET image_path = ? WHERE id = ?", imagePath, id)
				if err != nil {
					response["imageError"] = fmt.Sprintf("Saved image but failed to update record: %v", err)
				} else {
					response["imagePath"] = imagePath
				}
			}
		}

		c.JSON(http.StatusCreated, response)
	})

	// Edit movie by id
	r.PATCH("/movies/:id", func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
			return
		}

		var input struct {
			Title    string `json:"title"`
			Year     int    `json:"year"`
			Watched  bool   `json:"watched"`
			ImageUrl string `json:"imageUrl"` // Optional
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// First update the basic movie info
		result, err := db.Exec("UPDATE movies SET title = ?, year = ?, watched = ? WHERE id = ?",
			input.Title, input.Year, input.Watched, id)
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

		response := gin.H{
			"id":      id,
			"title":   input.Title,
			"year":    input.Year,
			"watched": input.Watched,
		}

		// Handle image URL if provided
		if input.ImageUrl != "" {
			// Get current image path to delete old image if exists
			var currentImagePath sql.NullString
			err := db.QueryRow("SELECT image_path FROM movies WHERE id = ?", id).Scan(&currentImagePath)
			if err != nil {
				response["imageError"] = fmt.Sprintf("Failed to check current image: %v", err)
			} else {
				// Process new image (using the int64 ID)
				imagePath, err := handleImageUpload(id, input.ImageUrl)
				if err != nil {
					response["imageError"] = err.Error()
				} else if imagePath != "" {
					// Update the movie with the new image path
					_, err = db.Exec("UPDATE movies SET image_path = ? WHERE id = ?", imagePath, id)
					if err != nil {
						response["imageError"] = fmt.Sprintf("Saved image but failed to update record: %v", err)
					} else {
						// Delete old image if it existed
						if currentImagePath.Valid && currentImagePath.String != "" {
							if err := os.Remove(currentImagePath.String); err != nil && !os.IsNotExist(err) {
								response["imageWarning"] = "New image saved but failed to delete old image"
							}
						}
						response["imagePath"] = imagePath
					}
				}
			}
		} else {
			// If no image URL provided, include existing image path in response
			var imagePath sql.NullString
			if err := db.QueryRow("SELECT image_path FROM movies WHERE id = ?", id).Scan(&imagePath); err == nil && imagePath.Valid {
				response["imagePath"] = imagePath.String
			}
		}

		c.JSON(http.StatusOK, response)
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

		var movie struct {
			ID        int
			ImagePath sql.NullString
		}

		err := db.QueryRow("SELECT id, image_path FROM movies WHERE id = ?", id).Scan(&movie.ID, &movie.ImagePath)
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

		// Check if there's an existing image and delete it
		if movie.ImagePath.Valid && movie.ImagePath.String != "" {
			if err := os.Remove(movie.ImagePath.String); err != nil && !os.IsNotExist(err) {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete existing image"})
				return
			}
		}

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
			// If update fails, try to delete the new image we just created
			os.Remove(imagePath)
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

// Reusable image upload function (similar to your existing endpoint logic)
func handleImageUpload(movieID int64, imageUrl string) (string, error) {
	// Download the image
	resp, err := http.Get(imageUrl)
	if err != nil {
		return "", fmt.Errorf("failed to download image: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to download image: status %d", resp.StatusCode)
	}

	// Check content type
	contentType := resp.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		return "", fmt.Errorf("URL does not point to an image")
	}

	// Create uploads directory if it doesn't exist
	if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
		return "", fmt.Errorf("could not create upload directory")
	}

	// Generate unique filename with movie ID
	ext := filepath.Ext(imageUrl)
	if ext == "" {
		ext = ".jpg" // Default extension
	}
	imageName := fmt.Sprintf("%d-%d%s", movieID, time.Now().UnixNano(), ext)
	imagePath := filepath.Join("uploads", imageName)

	// Create the file
	out, err := os.Create(imagePath)
	if err != nil {
		return "", fmt.Errorf("could not create file")
	}
	defer out.Close()

	// Copy the file
	if _, err := io.Copy(out, resp.Body); err != nil {
		os.Remove(imagePath) // Clean up if copy fails
		return "", fmt.Errorf("could not save file")
	}

	return imagePath, nil
}

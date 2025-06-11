package routes

import (
	"net/http"
	"strconv"

	"github.com/Ccw0925/watch-vault/internal/jikan"
	"github.com/gin-gonic/gin"
)

type AnimeHandler struct {
	jikanClient *jikan.Client
}

func NewAnimeHandler(jikanClient *jikan.Client) *AnimeHandler {
	return &AnimeHandler{jikanClient: jikanClient}
}

func RegisterAnimeRoutes(r *gin.Engine, jikanClient *jikan.Client) {
	handler := NewAnimeHandler(jikanClient)

	animeGroup := r.Group("/animes")
	{
		animeGroup.GET("/top", handler.GetTopAnime)
		animeGroup.GET("/:id", handler.GetAnimeById)
	}
}

func (h *AnimeHandler) GetAnimeById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	anime, err := h.jikanClient.GetAnimeById(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch anime",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, anime.Data)
}

func (h *AnimeHandler) GetTopAnime(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page <= 0 {
		page = 1
	}

	response, err := h.jikanClient.GetTopAnime(c.Request.Context(), page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch top anime",
			"details": err.Error(),
		})
		return
	}

	seen := make(map[int]bool)
	animeList := make([]gin.H, 0, len(response.Data))

	for _, anime := range response.Data {
		if seen[anime.ID] {
			continue
		}
		seen[anime.ID] = true

		animeList = append(animeList, gin.H{
			"id":       anime.ID,
			"title":    anime.Name,
			"year":     anime.Year,
			"genres":   anime.Genres,
			"rank":     anime.Rank,
			"score":    anime.Score,
			"scoredBy": anime.ScoredBy,
			"episodes": anime.Episodes,
			"status":   anime.Status,
			"images":   anime.Images,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"pagination": response.Pagination,
		"data":       animeList,
	})
}

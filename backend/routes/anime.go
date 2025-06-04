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

	animeGroup := r.Group("/anime")
	{
		animeGroup.GET("/top", handler.GetTopAnime)
	}
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

	animeList := make([]gin.H, 0, len(response.Data))
	for _, anime := range response.Data {
		animeList = append(animeList, gin.H{
			"id":    anime.ID,
			"title": anime.Name,
		})
	}

	c.JSON(http.StatusOK, animeList)
}

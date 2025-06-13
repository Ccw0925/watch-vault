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
		animeGroup.GET("", handler.ListAllAnime)
		animeGroup.GET("/top", handler.GetTopAnime)
		animeGroup.GET("/:id", handler.GetAnimeById)
	}
}

func (h *AnimeHandler) ListAllAnime(c *gin.Context) {
	page := getPageParam(c)
	genres := c.Query("genres")
	rating := c.Query("rating")
	orderBy := c.DefaultQuery("orderBy", "popularity")
	sort := c.DefaultQuery("sort", "asc")

	response, err := h.jikanClient.ListAllAnime(c.Request.Context(), page, genres, rating, orderBy, sort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch all anime",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"pagination": response.Pagination,
		"data":       buildAnimeResponse(response.Data),
	})
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

	c.JSON(http.StatusOK, animeToResponse(&anime.Data))
}

func (h *AnimeHandler) GetTopAnime(c *gin.Context) {
	page := getPageParam(c)

	response, err := h.jikanClient.GetTopAnime(c.Request.Context(), page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch top anime",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"pagination": response.Pagination,
		"data":       buildAnimeResponse(response.Data),
	})
}

func getPageParam(c *gin.Context) int {
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page <= 0 {
		return 1
	}
	return page
}

func buildAnimeResponse(data []jikan.Anime) []gin.H {
	seen := make(map[int]bool)
	animeList := make([]gin.H, 0, len(data))

	for _, anime := range data {
		if seen[anime.ID] {
			continue
		}
		seen[anime.ID] = true
		animeList = append(animeList, animeToResponse(&anime))
	}

	return animeList
}

func animeToResponse(anime *jikan.Anime) gin.H {
	return gin.H{
		"id":            anime.ID,
		"url":           anime.Url,
		"title":         anime.Name,
		"englishTitle":  anime.EnglishName,
		"japaneseTitle": anime.JapaneseName,
		"season":        anime.Season,
		"year":          anime.Year,
		"genres":        anime.Genres,
		"rank":          anime.Rank,
		"score":         anime.Score,
		"scoredBy":      anime.ScoredBy,
		"episodes":      anime.Episodes,
		"status":        anime.Status,
		"rating":        anime.Rating,
		"synopsis":      anime.Sypnosis,
		"images":        anime.Images,
		"aired":         anime.Aired,
		"duration":      anime.Duration,
		"members":       anime.Members,
		"favourites":    anime.Favourites,
		"studios":       anime.Studios,
		"themes":        anime.Themes,
		"producers":     anime.Producers,
		"demographics":  anime.Demographics,
	}
}

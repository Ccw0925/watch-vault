package routes

import (
	"net/http"
	"strconv"

	"cloud.google.com/go/firestore"
	"github.com/Ccw0925/watch-vault/internal/watchlist"
	"github.com/gin-gonic/gin"
)

type WatchlistHandler struct {
	service *watchlist.WatchlistService
}

func NewWatchlistHandler(client *firestore.Client) *WatchlistHandler {
	return &WatchlistHandler{
		service: watchlist.NewWatchlistService(client),
	}
}

func RegisterWatchlistRoutes(r *gin.Engine, client *firestore.Client) {
	handler := NewWatchlistHandler(client)

	watchlistGroup := r.Group("/watchlist")
	{
		watchlistGroup.GET("", handler.getWatchlist)
		watchlistGroup.POST("/:id", handler.addAnimeToWatchlist)
		watchlistGroup.DELETE("/:id", handler.removeAnimeFromWatchlist)
	}
}

func (w *WatchlistHandler) getWatchlist(c *gin.Context) {
	guestId := c.GetHeader("X-Guest-ID")
	showIdsOnly := c.Query("showIdsOnly")

	if guestId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing X-Guest-ID header"})
		return
	}

	watchlist, err := w.service.GetGuestWatchlist(c.Request.Context(), guestId, showIdsOnly == "true")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch watchlist",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, watchlist)
}

func (w *WatchlistHandler) addAnimeToWatchlist(c *gin.Context) {
	animeIdStr := c.Param("id")
	animeId, err := strconv.Atoi(animeIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Anime ID"})
		return
	}

	guestId := c.GetHeader("X-Guest-ID")
	if guestId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing X-Guest-ID header"})
		return
	}

	err = w.service.AddAnimeToWatchlist(c.Request.Context(), guestId, animeId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to add anime to watchlist",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (w *WatchlistHandler) removeAnimeFromWatchlist(c *gin.Context) {
	animeIdStr := c.Param("id")
	animeId, err := strconv.Atoi(animeIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Anime ID"})
		return
	}

	guestId := c.GetHeader("X-Guest-ID")
	if guestId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing X-Guest-ID header"})
		return
	}

	err = w.service.RemoveAnimeFromWatchlist(c.Request.Context(), guestId, animeId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to remove anime from watchlist",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

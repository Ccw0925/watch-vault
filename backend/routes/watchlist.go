package routes

import (
	"net/http"

	"cloud.google.com/go/firestore"
	service "github.com/Ccw0925/watch-vault/internal/watchlist"
	"github.com/gin-gonic/gin"
)

type WatchlistHandler struct {
	client *firestore.Client
}

func NewWatchlistHandler(client *firestore.Client) *WatchlistHandler {
	return &WatchlistHandler{client: client}
}

func RegisterWatchlistRoutes(r *gin.Engine, client *firestore.Client) {
	handler := NewWatchlistHandler(client)

	r.GET("/watchlist", handler.getWatchlist)
}

func (w *WatchlistHandler) getWatchlist(c *gin.Context) {
	guestId := c.GetHeader("X-Guest-ID")

	if guestId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing X-Guest-ID header"})
		return
	}

	watchlist, err := service.GetGuestWatchlist(w.client, c.Request.Context(), guestId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch watchlist",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, watchlist)
}

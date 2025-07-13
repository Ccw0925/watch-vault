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
		watchlistGroup.GET("/:id", handler.getAnimeById)
		watchlistGroup.POST("/:id", handler.addAnimeToWatchlist)
		watchlistGroup.DELETE("/:id", handler.removeAnimeFromWatchlist)
		watchlistGroup.PATCH("/:id", handler.updateAnimeStatus)
	}
}

func (w *WatchlistHandler) getWatchlist(c *gin.Context) {
	guestId := c.GetHeader("X-Guest-ID")
	if guestId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing X-Guest-ID header"})
		return
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "25"))
	if err != nil || limit <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page size"})
		return
	}

	startCursor := c.Query("startCursor")
	endCursor := c.Query("endCursor")
	direction := c.DefaultQuery("direction", "next")

	if direction != "next" && direction != "prev" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid direction - must be 'next' or 'prev'"})
		return
	}

	status := c.Query("status")
	watchStatus := watchlist.WatchStatus(-1)
	if status != "" {
		rws := watchlist.ReadableWatchStatus(status)
		if !watchlist.IsValid(rws) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
			return
		}
		watchStatus = rws.ToWatchStatus()
	}

	watchlist, firstID, lastID, hasNextPage, hasPrevPage, err := w.service.GetPaginatedWatchlist(
		c.Request.Context(),
		guestId,
		limit,
		startCursor,
		endCursor,
		direction,
		watchStatus,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch watchlist",
			"details": err.Error(),
		})
		return
	}

	response := gin.H{
		"data": watchlist,
		"pagination": gin.H{
			"itemCount":   len(watchlist),
			"pageSize":    limit,
			"hasPrevPage": hasPrevPage,
			"hasNextPage": hasNextPage,
		},
	}

	pagination := response["pagination"].(gin.H)
	if hasNextPage {
		pagination["nextPageCursor"] = lastID
	}
	if hasPrevPage {
		pagination["prevPageCursor"] = firstID
	}

	c.JSON(http.StatusOK, response)
}

func (w *WatchlistHandler) getAnimeById(c *gin.Context) {
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

	anime, err := w.service.GetAnimeById(c.Request.Context(), guestId, animeId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch anime",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, anime)
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

func (w *WatchlistHandler) updateAnimeStatus(c *gin.Context) {
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

	var requestBody struct {
		Status   watchlist.ReadableWatchStatus `json:"status" binding:"required"`
		Progress *int                          `json:"progress,omitempty"`
	}

	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	updateData := make(map[string]interface{})
	updateData["status"] = requestBody.Status.ToWatchStatus()

	if requestBody.Progress != nil {
		if *requestBody.Progress < 1 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Progress must be at least 1"})
			return
		}
		updateData["progress"] = *requestBody.Progress
	} else if requestBody.Status == watchlist.WatchingString {
		updateData["progress"] = 1
	}

	err = w.service.UpdateAnimeStatus(c.Request.Context(), guestId, animeId, updateData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to update anime status",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

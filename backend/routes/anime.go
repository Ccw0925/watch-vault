package routes

import (
	"cmp"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"slices"
	"strconv"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/Ccw0925/watch-vault/internal/jikan"
	watchlistService "github.com/Ccw0925/watch-vault/internal/watchlist"
	"github.com/gin-gonic/gin"
	"github.com/patrickmn/go-cache"
	"golang.org/x/sync/singleflight"
)

type AnimeHandler struct {
	jikanClient     *jikan.Client
	firestoreClient *firestore.Client
	cache           *cache.Cache
	group           singleflight.Group
}

func NewAnimeHandler(jikanClient *jikan.Client, firestoreClient *firestore.Client) *AnimeHandler {
	return &AnimeHandler{
		jikanClient:     jikanClient,
		firestoreClient: firestoreClient,
		cache:           cache.New(30*time.Minute, 15*time.Minute),
		group:           singleflight.Group{},
	}
}

func RegisterAnimeRoutes(r *gin.Engine, jikanClient *jikan.Client, firestoreClient *firestore.Client) {
	handler := NewAnimeHandler(jikanClient, firestoreClient)

	animeGroup := r.Group("/animes")
	{
		animeGroup.GET("", handler.ListAllAnime)
		animeGroup.GET("/top", handler.GetTopAnime)
		animeGroup.GET("/:id", handler.GetAnimeById)
		animeGroup.GET("/:id/episodes", handler.GetAnimeEpisodesById)
		animeGroup.GET("/:id/characters", handler.GetAnimeCharactersById)
		animeGroup.GET("/upcoming", handler.GetUpcomingAnimes)
		animeGroup.GET("/seasons/:year/:season", handler.GetSeasonalAnime)
		animeGroup.GET("/developer-recommendations", handler.GetDeveloperRecommendations)
	}
}

func (a *AnimeHandler) ListAllAnime(c *gin.Context) {
	page := getPageParam(c)
	limit := c.DefaultQuery("limit", "25")
	genres := c.Query("genres")
	rating := c.Query("rating")
	orderBy := c.DefaultQuery("orderBy", "popularity")
	sort := c.DefaultQuery("sort", "asc")
	q := c.Query("q")

	response, err := a.jikanClient.ListAllAnime(c.Request.Context(), page, limit, genres, rating, orderBy, sort, q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch all anime",
			"details": err.Error(),
		})
		return
	}

	guestId := c.GetHeader("X-Guest-ID")
	var watchlistMap map[int]bool
	if guestId != "" {
		watchlistMap, err = a.getWatchlistStatus(c.Request.Context(), guestId)
		if err != nil {
			log.Printf("Failed to get watchlist status: %v", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"pagination": response.Pagination,
		"data":       buildAnimeResponse(response.Data, watchlistMap),
	})
}

func (a *AnimeHandler) GetAnimeById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	anime, err := a.jikanClient.GetAnimeById(c.Request.Context(), id)
	if err != nil {
		if jikan.IsNotFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Anime not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch anime",
			"details": err.Error(),
		})
		return
	}

	relations, err := a.jikanClient.GetAnimeRelationsById(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch relations",
			"details": err.Error(),
		})
		return
	}

	animeData := animeToResponse(&anime.Data)
	animeData["relations"] = relations.Data

	c.JSON(http.StatusOK, animeData)
}

func (a *AnimeHandler) GetTopAnime(c *gin.Context) {
	page := getPageParam(c)
	limit := c.DefaultQuery("limit", "25")

	response, err := a.jikanClient.GetTopAnime(c.Request.Context(), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch top anime",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"pagination": response.Pagination,
		"data":       buildAnimeResponse(response.Data, nil),
	})
}

func (a *AnimeHandler) GetAnimeEpisodesById(c *gin.Context) {
	page := getPageParam(c)

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	episodes, err := a.jikanClient.GetAnimeEpisodesByAnimeId(c.Request.Context(), id, page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch episodes",
			"details": err.Error(),
		})
		return
	}

	var totalEpisodes *int
	if episodes.Pagination.LastVisiblePage > 1 {
		totalEpisodes, err = a.jikanClient.GetAnimeTotalEpisodesById(c.Request.Context(), id, episodes.Pagination.LastVisiblePage)
		if err != nil {
			totalEpisodes = nil
		}
	}

	response := gin.H{
		"pagination": episodes.Pagination,
		"data":       episodes.Data,
	}

	if totalEpisodes != nil {
		response["totalCount"] = totalEpisodes
	}

	c.JSON(http.StatusOK, response)
}

func (a *AnimeHandler) GetAnimeCharactersById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	characters, err := a.jikanClient.GetAnimeCharactersById(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch characters",
			"details": err.Error(),
		})
		return
	}

	slices.SortFunc(characters.Data, func(a, b jikan.AnimeCharacter) int {
		if a.Role != b.Role {
			if a.Role == "Main" {
				return -1
			} else if b.Role == "Main" {
				return 1
			}
		}

		return cmp.Compare(b.Favorites, a.Favorites)
	})

	c.JSON(http.StatusOK, characters.Data)
}

func (a *AnimeHandler) GetUpcomingAnimes(c *gin.Context) {
	page := getPageParam(c)
	limit := c.DefaultQuery("limit", "25")

	response, err := a.jikanClient.GetUpcomingAnimes(c.Request.Context(), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch upcoming anime",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"pagination": response.Pagination,
		"data":       buildAnimeResponse(response.Data, nil),
	})
}

func (a *AnimeHandler) GetSeasonalAnime(c *gin.Context) {
	page := getPageParam(c)

	year, err := strconv.Atoi(c.Param("year"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	season := c.Param("season")

	response, err := a.jikanClient.GetSeasonalAnime(c.Request.Context(), year, season, page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch seasonal anime",
			"details": err.Error(),
		})
		return
	}

	seasonsResponse, err := a.jikanClient.GetSeasonList(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch seasons",
			"details": err.Error(),
		})
		return
	}

	upcomingSeasons, previousSeasons := getSurroundingSeasons(seasonsResponse.Data, year, season)

	c.JSON(http.StatusOK, gin.H{
		"pagination":      response.Pagination,
		"data":            buildAnimeResponse(response.Data, nil),
		"upcomingSeasons": upcomingSeasons,
		"previousSeasons": previousSeasons,
	})
}

func (a *AnimeHandler) GetDeveloperRecommendations(c *gin.Context) {
	cacheKey := "developer_recommendations"

	if cached, found := a.cache.Get(cacheKey); found {
		c.Header("Cache-Control", "public, max-age=3600")
		c.JSON(http.StatusOK, cached)
		return
	}

	result, err, _ := a.group.Do(cacheKey, func() (interface{}, error) {
		animeIds := []int{5114, 9253, 16498, 18689, 24405, 41457}
		animes := make([]jikan.Anime, 0, len(animeIds))

		for _, animeId := range animeIds {
			time.Sleep(350 * time.Millisecond)
			anime, err := a.jikanClient.GetAnimeById(c.Request.Context(), animeId)
			if err != nil {
				return nil, err
			}
			animes = append(animes, anime.Data)
		}

		response := buildAnimeResponse(animes, nil)
		a.cache.Set(cacheKey, response, 12*time.Hour)
		return response, nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Header("Cache-Control", "public, max-age=3600")
	c.JSON(http.StatusOK, result)
}

func getPageParam(c *gin.Context) int {
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page <= 0 {
		return 1
	}
	return page
}

func buildAnimeResponse(data []jikan.Anime, watchlistMap map[int]bool) []gin.H {
	seen := make(map[int]bool)
	animeList := make([]gin.H, 0, len(data))

	for _, anime := range data {
		if seen[anime.ID] {
			continue
		}
		seen[anime.ID] = true

		animeData := animeToResponse(&anime)
		if watchlistMap != nil {
			animeData["inWatchlist"] = watchlistMap[anime.ID]
		}
		animeList = append(animeList, animeData)
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
		"trailer":       anime.Trailer,
	}
}

func getSurroundingSeasons(seasonsList []jikan.Season, targetYear int, targetSeason string) ([]gin.H, []gin.H) {
	var reversedSeasons []struct {
		Year    int
		Seasons []string
	}

	for _, yearEntry := range seasonsList {
		reversed := slices.Clone(yearEntry.Seasons)
		slices.Reverse(reversed)

		reversedSeasons = append(reversedSeasons, struct {
			Year    int
			Seasons []string
		}{yearEntry.Year, reversed})
	}

	type seasonPair struct {
		year   int
		season string
	}

	var allSeasons []seasonPair

	for _, yearEntry := range reversedSeasons {
		for _, season := range yearEntry.Seasons {
			allSeasons = append(allSeasons, seasonPair{yearEntry.Year, season})
		}
	}

	var targetIndex int = -1
	for i, pair := range allSeasons {
		if pair.year == targetYear && pair.season == targetSeason {
			targetIndex = i
			break
		}
	}

	if targetIndex == -1 {
		return []gin.H{}, []gin.H{}
	}

	upcoming := make([]gin.H, 0, 3)
	for i := targetIndex - 1; i >= 0 && len(upcoming) < 3; i-- {
		upcoming = append(upcoming, gin.H{
			"year":   allSeasons[i].year,
			"season": allSeasons[i].season,
		})
	}

	previous := make([]gin.H, 0, 3)
	for i := targetIndex + 1; i < len(allSeasons) && len(previous) < 3; i++ {
		previous = append(previous, gin.H{
			"year":   allSeasons[i].year,
			"season": allSeasons[i].season,
		})
	}

	return upcoming, previous
}

func (a *AnimeHandler) addAnimeAsMap(anime *jikan.Anime, ctx context.Context) error {
	var animeMap map[string]interface{}
	animeBytes, err := json.Marshal(anime)
	if err != nil {
		return err
	}
	if err := json.Unmarshal(animeBytes, &animeMap); err != nil {
		return err
	}

	_, err = a.firestoreClient.Collection("animes").Doc(fmt.Sprintf("%d", anime.ID)).Set(ctx, animeMap)
	if err != nil {
		log.Printf("An error has occurred: %s", err)
	}

	return err
}

func (a *AnimeHandler) getWatchlistStatus(ctx context.Context, guestId string) (map[int]bool, error) {
	if guestId == "" {
		return nil, nil
	}

	service := watchlistService.NewWatchlistService(a.firestoreClient)
	watchlist, err := service.GetGuestWatchlist(ctx, guestId, true)
	if err != nil {
		return nil, err
	}

	watchlistMap := make(map[int]bool)
	if ids, ok := watchlist.([]int); ok {
		for _, id := range ids {
			watchlistMap[id] = true
		}
	}

	return watchlistMap, nil
}

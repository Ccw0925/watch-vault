package routes

import (
	"cmp"
	"net/http"
	"slices"
	"strconv"
	"time"

	"github.com/Ccw0925/watch-vault/internal/jikan"
	"github.com/gin-gonic/gin"
	"github.com/patrickmn/go-cache"
	"golang.org/x/sync/singleflight"
)

type AnimeHandler struct {
	jikanClient *jikan.Client
	cache       *cache.Cache
	group       singleflight.Group
}

func NewAnimeHandler(jikanClient *jikan.Client) *AnimeHandler {
	return &AnimeHandler{
		jikanClient: jikanClient,
		cache:       cache.New(30*time.Minute, 15*time.Minute),
		group:       singleflight.Group{},
	}
}

func RegisterAnimeRoutes(r *gin.Engine, jikanClient *jikan.Client) {
	handler := NewAnimeHandler(jikanClient)

	animeGroup := r.Group("/animes")
	{
		animeGroup.GET("", handler.ListAllAnime)
		animeGroup.GET("/top", handler.GetTopAnime)
		animeGroup.GET("/:id", handler.GetAnimeById)
		animeGroup.GET("/:id/episodes", handler.GetAnimeEpisodesById)
		animeGroup.GET("/:id/characters", handler.GetAnimeCharactersById)
		animeGroup.GET("/upcoming", handler.GetUpcomingAnimes)
		animeGroup.GET("/seasons/:year/:season", handler.GetSeasonalAnime)
		animeGroup.GET("/developer-recomendations", handler.GetDeveloperRecommendations)
	}
}

func (h *AnimeHandler) ListAllAnime(c *gin.Context) {
	page := getPageParam(c)
	limit := c.DefaultQuery("limit", "25")
	genres := c.Query("genres")
	rating := c.Query("rating")
	orderBy := c.DefaultQuery("orderBy", "popularity")
	sort := c.DefaultQuery("sort", "asc")
	q := c.Query("q")

	response, err := h.jikanClient.ListAllAnime(c.Request.Context(), page, limit, genres, rating, orderBy, sort, q)
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

	relations, err := h.jikanClient.GetAnimeRelationsById(c.Request.Context(), id)
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

func (h *AnimeHandler) GetTopAnime(c *gin.Context) {
	page := getPageParam(c)
	limit := c.DefaultQuery("limit", "25")

	response, err := h.jikanClient.GetTopAnime(c.Request.Context(), page, limit)
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

func (h *AnimeHandler) GetAnimeEpisodesById(c *gin.Context) {
	page := getPageParam(c)

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	episodes, err := h.jikanClient.GetAnimeEpisodesByAnimeId(c.Request.Context(), id, page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch episodes",
			"details": err.Error(),
		})
		return
	}

	var totalEpisodes *int
	if episodes.Pagination.LastVisiblePage > 1 {
		totalEpisodes, err = h.jikanClient.GetAnimeTotalEpisodesById(c.Request.Context(), id, episodes.Pagination.LastVisiblePage)
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

func (h *AnimeHandler) GetAnimeCharactersById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	characters, err := h.jikanClient.GetAnimeCharactersById(c.Request.Context(), id)
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

func (h *AnimeHandler) GetUpcomingAnimes(c *gin.Context) {
	page := getPageParam(c)
	limit := c.DefaultQuery("limit", "25")

	response, err := h.jikanClient.GetUpcomingAnimes(c.Request.Context(), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch upcoming anime",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"pagination": response.Pagination,
		"data":       buildAnimeResponse(response.Data),
	})
}

func (h *AnimeHandler) GetSeasonalAnime(c *gin.Context) {
	page := getPageParam(c)

	year, err := strconv.Atoi(c.Param("year"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	season := c.Param("season")

	response, err := h.jikanClient.GetSeasonalAnime(c.Request.Context(), year, season, page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch seasonal anime",
			"details": err.Error(),
		})
		return
	}

	seasonsResponse, err := h.jikanClient.GetSeasonList(c.Request.Context())
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
		"data":            buildAnimeResponse(response.Data),
		"upcomingSeasons": upcomingSeasons,
		"previousSeasons": previousSeasons,
	})
}

func (h *AnimeHandler) GetDeveloperRecommendations(c *gin.Context) {
	cacheKey := "developer_recommendations"

	if cached, found := h.cache.Get(cacheKey); found {
		c.Header("Cache-Control", "public, max-age=3600")
		c.JSON(http.StatusOK, cached)
		return
	}

	result, err, _ := h.group.Do(cacheKey, func() (interface{}, error) {
		animeIds := []int{5114, 9253, 16498, 18689, 24405, 41457}
		animes := make([]jikan.Anime, 0, len(animeIds))

		for _, animeId := range animeIds {
			time.Sleep(350 * time.Millisecond)
			anime, err := h.jikanClient.GetAnimeById(c.Request.Context(), animeId)
			if err != nil {
				return nil, err
			}
			animes = append(animes, anime.Data)
		}

		response := buildAnimeResponse(animes)
		h.cache.Set(cacheKey, response, 12*time.Hour)
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

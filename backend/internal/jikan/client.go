package jikan

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"time"

	"github.com/patrickmn/go-cache"
)

type Client struct {
	baseURL    string
	httpClient *http.Client
	cache      *cache.Cache
}

func NewClient() *Client {
	return &Client{
		baseURL:    "https://api.jikan.moe/v4",
		httpClient: &http.Client{Timeout: 10 * time.Second},
		cache:      cache.New(30*time.Minute, 10*time.Minute),
	}
}

func (c *Client) makeRequest(ctx context.Context, endpoint string, queryParams map[string]string, result interface{}) error {
	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return fmt.Errorf("error creating request: %w", err)
	}

	if queryParams != nil {
		q := req.URL.Query()
		for key, value := range queryParams {
			q.Add(key, value)
		}
		req.URL.RawQuery = q.Encode()
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		if resp.StatusCode == http.StatusNotFound {
			return ErrNotFound
		}

		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
		return fmt.Errorf("error decoding response: %w", err)
	}

	return nil
}

func (c *Client) cachedRequest(cacheKey string, result interface{}, fn func() error) error {
	if cached, found := c.cache.Get(cacheKey); found {
		reflect.ValueOf(result).Elem().Set(reflect.ValueOf(cached).Elem())
		return nil
	}

	if err := fn(); err != nil {
		return err
	}

	c.cache.Set(cacheKey, result, cache.DefaultExpiration)
	return nil
}

func (c *Client) ListAllAnime(ctx context.Context, page int, limit, genres, rating, orderBy, sort, queryString string) (*AnimesListResponse, error) {
	cacheKey := fmt.Sprintf("all_anime:%d:%s:%s:%s:%s:%s:%s", page, limit, genres, rating, orderBy, sort, queryString)
	var result AnimesListResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/anime", c.baseURL)
		queryParams := map[string]string{
			"page":     fmt.Sprintf("%d", page),
			"limit":    limit,
			"genres":   genres,
			"rating":   rating,
			"order_by": orderBy,
			"sort":     sort,
			"q":        queryString,
		}
		return c.makeRequest(ctx, endpoint, queryParams, &result)
	})

	return &result, err
}

func (c *Client) GetAnimeById(ctx context.Context, id int) (*AnimeResponse, error) {
	cacheKey := fmt.Sprintf("anime:%d", id)
	var result AnimeResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/anime/%d", c.baseURL, id)
		return c.makeRequest(ctx, endpoint, nil, &result)
	})

	return &result, err
}

func (c *Client) GetTopAnime(ctx context.Context, page int, limit string) (*AnimesListResponse, error) {
	cacheKey := fmt.Sprintf("top_anime:%d:%s", page, limit)
	var result AnimesListResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/top/anime?page=%d", c.baseURL, page)
		queryParams := map[string]string{
			"limit": limit,
		}
		return c.makeRequest(ctx, endpoint, queryParams, &result)
	})

	return &result, err
}

func (c *Client) GetAnimeEpisodesByAnimeId(ctx context.Context, id, page int) (*AnimeEpisodesResponse, error) {
	cacheKey := fmt.Sprintf("anime_episodes:%d:%d", id, page)
	var result AnimeEpisodesResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/anime/%d/episodes", c.baseURL, id)
		return c.makeRequest(ctx, endpoint, map[string]string{"page": fmt.Sprintf("%d", page)}, &result)
	})

	return &result, err
}

func (c *Client) GetAnimeTotalEpisodesById(ctx context.Context, id, lastPage int) (*int, error) {
	cacheKey := fmt.Sprintf("anime_episodes:%d:%d", id, lastPage)
	var result AnimeEpisodesResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/anime/%d/episodes", c.baseURL, id)
		return c.makeRequest(ctx, endpoint, map[string]string{"page": fmt.Sprintf("%d", lastPage)}, &result)
	})

	if err != nil {
		return nil, err
	}

	totalEpisodes := ((result.Pagination.LastVisiblePage - 1) * 100) + len(result.Data)
	return &totalEpisodes, nil
}

func (c *Client) GetAnimeRelationsById(ctx context.Context, id int) (*AnimeRelationsResponse, error) {
	cacheKey := fmt.Sprintf("anime_relations:%d", id)
	var result AnimeRelationsResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/anime/%d/relations", c.baseURL, id)
		return c.makeRequest(ctx, endpoint, nil, &result)
	})

	return &result, err
}

func (c *Client) GetAnimeCharactersById(ctx context.Context, id int) (*AnimeCharactersResponse, error) {
	cacheKey := fmt.Sprintf("anime_characters:%d", id)
	var result AnimeCharactersResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/anime/%d/characters", c.baseURL, id)
		return c.makeRequest(ctx, endpoint, nil, &result)
	})

	return &result, err
}

func (c *Client) GetUpcomingAnimes(ctx context.Context, page int) (*AnimesListResponse, error) {
	cacheKey := fmt.Sprintf("upcoming_anime:%d", page)
	var result AnimesListResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/seasons/upcoming?page=%d", c.baseURL, page)
		return c.makeRequest(ctx, endpoint, nil, &result)
	})

	return &result, err
}

func (c *Client) GetSeasonalAnime(ctx context.Context, year int, season string, page int) (*AnimesListResponse, error) {
	cacheKey := fmt.Sprintf("seasonal_anime:%d:%s:%d", year, season, page)
	var result AnimesListResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/seasons/%4d/%s?page=%d", c.baseURL, year, season, page)
		return c.makeRequest(ctx, endpoint, nil, &result)
	})

	return &result, err
}

func (c *Client) GetSeasonList(ctx context.Context) (*SeasonListResponse, error) {
	cacheKey := "season_list"
	var result SeasonListResponse

	err := c.cachedRequest(cacheKey, &result, func() error {
		endpoint := fmt.Sprintf("%s/seasons", c.baseURL)
		return c.makeRequest(ctx, endpoint, nil, &result)
	})

	return &result, err
}

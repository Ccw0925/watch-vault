package jikan

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
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

func (c *Client) ListAllAnime(ctx context.Context, page int, genres string, rating string, orderBy string, sort string, queryString string) (*AnimesListResponse, error) {
	cacheKey := fmt.Sprintf("all_anime:%d:%s:%s:%s:%s:%s", page, genres, rating, orderBy, sort, queryString)

	if cached, found := c.cache.Get(cacheKey); found {
		return cached.(*AnimesListResponse), nil
	}

	endpoint := fmt.Sprintf("%s/anime", c.baseURL)

	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	q := req.URL.Query()

	q.Add("page", fmt.Sprintf("%d", page))
	q.Add("genres", genres)
	q.Add("rating", rating)
	q.Add("order_by", orderBy)
	q.Add("sort", sort)
	q.Add("q", queryString)

	req.URL.RawQuery = q.Encode()

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var result AnimesListResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	c.cache.Set(cacheKey, &result, cache.DefaultExpiration)

	return &result, nil
}

func (c *Client) GetAnimeById(ctx context.Context, id int) (*AnimeResponse, error) {
	cacheKey := fmt.Sprintf("anime:%d", id)

	if cached, found := c.cache.Get(cacheKey); found {
		return cached.(*AnimeResponse), nil
	}

	endpoint := fmt.Sprintf("%s/anime/%d", c.baseURL, id)

	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var result AnimeResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	c.cache.Set(cacheKey, &result, cache.DefaultExpiration)

	return &result, nil
}

func (c *Client) GetTopAnime(ctx context.Context, page int) (*AnimesListResponse, error) {
	cacheKey := fmt.Sprintf("top_anime:%d", page)

	if cached, found := c.cache.Get(cacheKey); found {
		return cached.(*AnimesListResponse), nil
	}

	endpoint := fmt.Sprintf("%s/top/anime?page=%d", c.baseURL, page)

	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var result AnimesListResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	c.cache.Set(cacheKey, &result, cache.DefaultExpiration)

	return &result, nil
}

func (c *Client) GetAnimeEpisodesByAnimeId(ctx context.Context, id int, page int) (*AnimeEpisodesResponse, error) {
	cacheKey := fmt.Sprintf("anime_episodes:%d:%d", id, page)

	if cached, found := c.cache.Get(cacheKey); found {
		return cached.(*AnimeEpisodesResponse), nil
	}

	endpoint := fmt.Sprintf("%s/anime/%d/episodes", c.baseURL, id)

	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	q := req.URL.Query()
	q.Add("page", fmt.Sprintf("%d", page))
	req.URL.RawQuery = q.Encode()

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var result AnimeEpisodesResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	c.cache.Set(cacheKey, &result, cache.DefaultExpiration)

	return &result, nil
}

func (c *Client) GetAnimeTotalEpisodesById(ctx context.Context, id int, lastPage int) (*int, error) {
	cacheKey := fmt.Sprintf("anime_episodes:%d:%d", id, lastPage)

	if cached, found := c.cache.Get(cacheKey); found {
		animeEpisodesResponse := cached.(*AnimeEpisodesResponse)
		totalEpisodes := ((animeEpisodesResponse.Pagination.LastVisiblePage - 1) * 100) + len(animeEpisodesResponse.Data)
		return &totalEpisodes, nil
	}

	endpoint := fmt.Sprintf("%s/anime/%d/episodes", c.baseURL, id)

	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	q := req.URL.Query()
	q.Add("page", fmt.Sprintf("%d", lastPage))
	req.URL.RawQuery = q.Encode()

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var result AnimeEpisodesResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	c.cache.Set(cacheKey, &result, cache.DefaultExpiration)

	totalEpisodes := ((result.Pagination.LastVisiblePage - 1) * 100) + len(result.Data)
	return &totalEpisodes, nil
}

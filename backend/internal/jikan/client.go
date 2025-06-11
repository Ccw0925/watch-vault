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

func (c *Client) GetAnimeById(ctx context.Context, id int) (*AnimeResponse, error) {
	cacheKey := fmt.Sprintf("anime_%d", id)

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

func (c *Client) GetTopAnime(ctx context.Context, page int) (*TopAnimeResponse, error) {
	cacheKey := fmt.Sprintf("top_anime_%d", page)

	if cached, found := c.cache.Get(cacheKey); found {
		return cached.(*TopAnimeResponse), nil
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

	var result TopAnimeResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	c.cache.Set(cacheKey, &result, cache.DefaultExpiration)

	return &result, nil
}

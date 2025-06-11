package jikan

type Pagination struct {
	LastVisiblePage int  `json:"last_visible_page"`
	HasNextPage     bool `json:"has_next_page"`
	CurrentPage     int  `json:"current_page"`
	Items           struct {
		Count   int `json:"count"`
		Total   int `json:"total"`
		PerPage int `json:"per_page"`
	} `json:"items"`
}

type Anime struct {
	ID       int     `json:"mal_id"`
	Name     string  `json:"title"`
	Year     int     `json:"year"`
	Genres   []Genre `json:"genres"`
	Rank     int     `json:"rank"`
	Score    float32 `json:"score"`
	ScoredBy int     `json:"scored_by"`
	Episodes int     `json:"episodes"`
	Status   string  `json:"status"`
	Images   Images  `json:"images"`
}

type Genre struct {
	ID   int    `json:"mal_id"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

type Images struct {
	Webp struct {
		LargeImageUrl string `json:"large_image_url"`
	} `json:"webp"`
}

type AnimeResponse struct {
	Data Anime `json:"data"`
}

type TopAnimeResponse struct {
	Pagination Pagination `json:"pagination"`
	Data       []Anime    `json:"data"`
}

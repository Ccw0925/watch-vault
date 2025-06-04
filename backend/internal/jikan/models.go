package jikan

type Anime struct {
	ID   int    `json:"mal_id"`
	Name string `json:"title"`
}

type TopAnimeResponse struct {
	Data []Anime `json:"data"`
}

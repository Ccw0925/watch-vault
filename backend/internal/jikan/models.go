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
	ID           int           `json:"mal_id"`
	Url          string        `json:"url"`
	Name         string        `json:"title"`
	EnglishName  string        `json:"title_english"`
	JapaneseName string        `json:"title_japanese"`
	Year         int           `json:"year"`
	Genres       []Genre       `json:"genres"`
	Rank         int           `json:"rank"`
	Score        float32       `json:"score"`
	ScoredBy     int           `json:"scored_by"`
	Episodes     int           `json:"episodes"`
	Status       string        `json:"status"`
	Season       string        `json:"season"`
	Rating       string        `json:"rating"`
	Sypnosis     string        `json:"synopsis"`
	Images       Images        `json:"images"`
	Aired        Aired         `json:"aired"`
	Duration     string        `json:"duration"`
	Members      int           `json:"members"`
	Favourites   int           `json:"favorites"`
	Studios      []Studio      `json:"studios"`
	Themes       []Theme       `json:"themes"`
	Producers    []Producer    `json:"producers"`
	Demographics []DemoGraphic `json:"demographics"`
	Trailer      Trailer       `json:"trailer"`
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

type Aired struct {
	String string `json:"string"`
}

type Studio struct {
	ID   int    `json:"mal_id"`
	Type string `json:"type"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

type Producer struct {
	ID   int    `json:"mal_id"`
	Type string `json:"type"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

type Theme struct {
	ID   int    `json:"mal_id"`
	Type string `json:"type"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

type DemoGraphic struct {
	ID   int    `json:"mal_id"`
	Type string `json:"type"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

type Episode struct {
	ID       int     `json:"mal_id"`
	URL      string  `json:"url"`
	Title    string  `json:"title"`
	Aired    string  `json:"aired"`
	Score    float32 `json:"score"`
	Filler   bool    `json:"filler"`
	Recap    bool    `json:"recap"`
	ForumURL string  `json:"forum_url"`
}

type AnimeCharacter struct {
	Character   Character    `json:"character"`
	Role        string       `json:"role"`
	Favorites   int          `json:"favorites"`
	VoiceActors []VoiceActor `json:"voice_actors"`
}

type Character struct {
	ID     int    `json:"mal_id"`
	Name   string `json:"name"`
	URL    string `json:"url"`
	Images struct {
		Webp struct {
			ImageURL string `json:"image_url"`
		} `json:"webp"`
	} `json:"images"`
}

type VoiceActor struct {
	Person struct {
		ID     int    `json:"mal_id"`
		Name   string `json:"name"`
		URL    string `json:"url"`
		Images struct {
			Jpg struct {
				ImageURL string `json:"image_url"`
			} `json:"jpg"`
		} `json:"images"`
	} `json:"person"`
	Language string `json:"language"`
}

type Trailer struct {
	YoutubeID string `json:"youtube_id"`
}

type Season struct {
	Year    int      `json:"year"`
	Seasons []string `json:"seasons"`
}

type AnimeEpisodesResponse struct {
	Pagination struct {
		LastVisiblePage int  `json:"last_visible_page"`
		HasNextPage     bool `json:"has_next_page"`
	} `json:"pagination"`
	Data []Episode `json:"data"`
}

type AnimeResponse struct {
	Data Anime `json:"data"`
}

type AnimesListResponse struct {
	Pagination Pagination `json:"pagination"`
	Data       []Anime    `json:"data"`
}

type AnimeRelationsResponse struct {
	Data []struct {
		Relation string `json:"relation"`
		Entry    []struct {
			ID   int    `json:"mal_id"`
			Type string `json:"type"`
			Name string `json:"name"`
			URL  string `json:"url"`
		} `json:"entry"`
	} `json:"data"`
}

type AnimeCharactersResponse struct {
	Data []AnimeCharacter `json:"data"`
}

type SeasonListResponse struct {
	Data       []Season `json:"data"`
	Pagination struct {
		LastVisiblePage int  `json:"last_visible_page"`
		HasNextPage     bool `json:"has_next_page"`
	} `json:"pagination"`
}

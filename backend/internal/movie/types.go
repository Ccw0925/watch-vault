package movie

import "time"

type Movie struct {
	ID      string    `json:"id"`
	Title   string    `json:"title" binding:"required"`
	Year    int       `json:"year" binding:"required,gt=1888"`
	Watched bool      `json:"watched"`
	Created time.Time `json:"created"`
	Updated time.Time `json:"updated"`
	// ImagePathObject sql.NullString `json:"imagePathObject"`
	// ImagePath string `json:"imagePath"`
}

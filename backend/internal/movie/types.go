package movie

import "database/sql"

type Movie struct {
	ID              int            `json:"id"`
	Title           string         `json:"title" binding:"required"`
	Year            int            `json:"year" binding:"required,gt=1888"`
	Watched         bool           `json:"watched"`
	ImagePathObject sql.NullString `json:"imagePathObject"`
	ImagePath       string         `json:"imagePath"`
}

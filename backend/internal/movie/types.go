package movie

type Movie struct {
	ID      int    `json:"id"`
	Title   string `json:"title" binding:"required"`
	Year    int    `json:"year" binding:"required,gt=1888,lte=2025"`
	Watched bool   `json:"watched"`
}

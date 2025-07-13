package anime

import (
	"github.com/Ccw0925/watch-vault/internal/jikan"
	"github.com/gin-gonic/gin"
)

func AnimeToResponse(anime *jikan.Anime) gin.H {
	return gin.H{
		"id":            anime.ID,
		"url":           anime.Url,
		"title":         anime.Name,
		"englishTitle":  anime.EnglishName,
		"japaneseTitle": anime.JapaneseName,
		"season":        anime.Season,
		"year":          anime.Year,
		"type":          anime.Type,
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

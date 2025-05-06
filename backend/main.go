package main

import (
	"database/sql"
	"log"

	"github.com/Ccw0925/watch-vault/routes"
	_ "github.com/mattn/go-sqlite3"

	"github.com/pressly/goose/v3"
)

func main() {
	// Initialize SQLite database
	db, err := sql.Open("sqlite3", "./watchlist.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := goose.Up(db, "./db/migrations"); err != nil {
		log.Fatal(err)
	}

	r := routes.SetupRoutes(db)
	r.Run(":8080")
}

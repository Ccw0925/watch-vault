package main

import (
	"database/sql"
	"log"

	"github.com/Ccw0925/movie-watchlist/routes"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	// Initialize SQLite database
	db, err := sql.Open("sqlite3", "./watchlist.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create tables (if not exists)
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS movies (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			year INTEGER,
			watched BOOLEAN DEFAULT FALSE
		);
	`)

	if err != nil {
		log.Fatal(err)
	}

	r := routes.SetupRoutes(db)
	r.Run(":8080")
}

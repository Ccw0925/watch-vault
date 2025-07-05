package main

import (
	"context"
	"log"
	"os"

	"github.com/Ccw0925/watch-vault/internal/firebase"
	"github.com/Ccw0925/watch-vault/routes"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"google.golang.org/api/option"
)

func main() {
	if _, err := os.Stat(".env"); err == nil {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	// Set up Firebase
	ctx := context.Background()

	var sa option.ClientOption
	if creds := os.Getenv("FIREBASE_CREDENTIALS_JSON"); creds != "" {
		sa = option.WithCredentialsJSON([]byte(creds))
	} else {
		sa = option.WithCredentialsFile(os.Getenv("FIREBASE_SERVICE_ACCOUNT_JSON"))
	}

	client, err := firebase.NewClient(ctx, sa)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	r := routes.SetupRoutes(client, ctx)
	r.Run(":8080")
}

package main

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebaseSdk "firebase.google.com/go"
	"github.com/Ccw0925/watch-vault/internal/firebase"
	"github.com/Ccw0925/watch-vault/routes"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"google.golang.org/api/option"
)

func main() {
	envErr := godotenv.Load()
	if envErr != nil {
		log.Fatal("Error loading .env file")
	}

	// Set up Firebase
	ctx := context.Background()

	var (
		client *firestore.Client
		err    error
	)

	if creds := os.Getenv("FIREBASE_SERVICE_ACCOUNT_JSON"); creds != "" {
		// For local development - use file
		sa := option.WithCredentialsFile(creds)
		client, err = firebase.NewClient(ctx, sa)
	} else {
		// Use Application Default Credentials (ADC)
		var app *firebaseSdk.App
		app, err = firebaseSdk.NewApp(ctx, nil)
		if err == nil {
			client, err = app.Firestore(ctx)
		}
	}

	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	r := routes.SetupRoutes(client, ctx)
	r.Run(":8080")
}

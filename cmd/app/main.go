package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	staticPath := os.Getenv("STATIC_PATH")

	fs := http.FileServer(http.Dir(staticPath))
	http.Handle("/", fs)

	port := ":5176"
	log.Printf("Starting server on %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

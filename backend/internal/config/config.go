package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DB_URL     string
	JWT_SECRET string
	PORT       string
}

func LoadConfig() Config {

	err := godotenv.Load()

	if err != nil {
		log.Println("No .env file found")
	}

	return Config{
		DB_URL:     os.Getenv("DB_URL"),
		JWT_SECRET: os.Getenv("JWT_SECRET"),
		PORT:       os.Getenv("PORT"),
	}
}

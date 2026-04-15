package database

import (
	"database/sql"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB

func Connect(dbURL string) {

	db, err := sql.Open(
		"pgx",
		dbURL,
	)

	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()

	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	log.Println("Database connected successfully")

	DB = db
}

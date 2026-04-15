package repository

import (
	"taskflow/internal/database"
	"taskflow/internal/models"
)

func CreateUser(
	user models.User,
) error {

	query := `
	INSERT INTO users
	(id, name, email, password)
	VALUES ($1, $2, $3, $4)
	`

	_, err := database.DB.Exec(
		query,
		user.ID,
		user.Name,
		user.Email,
		user.Password,
	)

	return err
}

func GetUserByEmail(
	email string,
) (models.User, error) {

	var user models.User

	query := `
	SELECT id, name, email, password
	FROM users
	WHERE email=$1
	`

	err := database.DB.QueryRow(
		query,
		email,
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
	)

	return user, err
}

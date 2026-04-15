package service

import (
	"time"

	"github.com/google/uuid"

	"taskflow/internal/models"
	"taskflow/internal/repository"
	"taskflow/internal/utils"
)

func RegisterUser(
	name string,
	email string,
	password string,
) (models.User, error) {

	hash, err :=
		utils.HashPassword(password)

	if err != nil {
		return models.User{}, err
	}

	user := models.User{
		ID:        uuid.New().String(),
		Name:      name,
		Email:     email,
		Password:  hash,
		CreatedAt: time.Now(),
	}

	err = repository.CreateUser(user)

	return user, err
}

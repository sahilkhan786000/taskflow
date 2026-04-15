package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"taskflow/internal/database"
	"taskflow/internal/utils"
)

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// POST /auth/register
func Register(c *gin.Context) {

	var req RegisterRequest

	if err := c.BindJSON(&req); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "validation failed",
		})

		return
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "all fields are required",
		})

		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to hash password",
		})

		return
	}

	userID := uuid.New().String()

	query := `
	INSERT INTO users
	(id, name, email, password, created_at)
	VALUES ($1, $2, $3, $4, $5)
	`

	_, err = database.DB.Exec(
		query,
		userID,
		req.Name,
		req.Email,
		hashedPassword,
		time.Now(),
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create user",
		})

		return
	}

	token, err := utils.GenerateToken(
		userID,
		req.Email,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to generate token",
		})

		return
	}

	c.JSON(
		http.StatusCreated,
		gin.H{
			"user": gin.H{
				"id":    userID,
				"name":  req.Name,
				"email": req.Email,
			},
			"token": token,
		},
	)
}

// POST /auth/login
func Login(c *gin.Context) {

	var req LoginRequest

	if err := c.BindJSON(&req); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "validation failed",
		})

		return
	}

	if req.Email == "" || req.Password == "" {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "email and password required",
		})

		return
	}

	var userID string
	var name string
	var email string
	var hashedPassword string

	query := `
	SELECT id, name, email, password
	FROM users
	WHERE email = $1
	`

	err := database.DB.QueryRow(
		query,
		req.Email,
	).Scan(
		&userID,
		&name,
		&email,
		&hashedPassword,
	)

	if err != nil {

		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid credentials",
		})

		return
	}

	if !utils.CheckPassword(
		req.Password,
		hashedPassword,
	) {

		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid credentials",
		})

		return
	}

	token, err := utils.GenerateToken(
		userID,
		email,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to generate token",
		})

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"user": gin.H{
				"id":    userID,
				"name":  name,
				"email": email,
			},
			"token": token,
		},
	)
}

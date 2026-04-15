package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"taskflow/internal/database"
)

type Project struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	OwnerID     string    `json:"owner_id"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateProjectRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type UpdateProjectRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// GET /projects
// List projects owned by current user
func GetProjects(c *gin.Context) {

	userID, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})
		return
	}

	query := `
		SELECT id, name, description, owner_id, created_at
		FROM projects
		WHERE owner_id = $1
		ORDER BY created_at DESC
	`

	rows, err := database.DB.Query(
		query,
		userID,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch projects",
		})

		return
	}

	defer rows.Close()

	var projects []Project

	for rows.Next() {

		var p Project

		err := rows.Scan(
			&p.ID,
			&p.Name,
			&p.Description,
			&p.OwnerID,
			&p.CreatedAt,
		)

		if err != nil {
			continue
		}

		projects = append(
			projects,
			p,
		)
	}

	c.JSON(
		http.StatusOK,
		projects,
	)
}

// POST /projects
// Create new project
func CreateProject(c *gin.Context) {

	userID, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})
		return
	}

	var req CreateProjectRequest

	if err := c.BindJSON(&req); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request",
		})

		return
	}

	if req.Name == "" {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "name is required",
		})

		return
	}

	projectID := uuid.New().String()

	query := `
		INSERT INTO projects
		(id, name, description, owner_id)
		VALUES ($1, $2, $3, $4)
	`

	_, err := database.DB.Exec(
		query,
		projectID,
		req.Name,
		req.Description,
		userID,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create project",
		})

		return
	}

	c.JSON(
		http.StatusCreated,
		gin.H{
			"id":          projectID,
			"name":        req.Name,
			"description": req.Description,
			"owner_id":    userID,
		},
	)
}

// GET /projects/:id
// Get project details
func GetProjectByID(c *gin.Context) {

	projectID := c.Param("id")

	var project Project

	query := `
		SELECT id, name, description, owner_id, created_at
		FROM projects
		WHERE id = $1
	`

	err := database.DB.QueryRow(
		query,
		projectID,
	).Scan(
		&project.ID,
		&project.Name,
		&project.Description,
		&project.OwnerID,
		&project.CreatedAt,
	)

	if err == sql.ErrNoRows {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "not found",
		})

		return
	}

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch project",
		})

		return
	}

	c.JSON(
		http.StatusOK,
		project,
	)
}

// PATCH /projects/:id
// Update project
func UpdateProject(c *gin.Context) {

	projectID := c.Param("id")

	var req UpdateProjectRequest

	if err := c.BindJSON(&req); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request",
		})

		return
	}

	query := `
		UPDATE projects
		SET name = $1,
		    description = $2
		WHERE id = $3
	`

	result, err := database.DB.Exec(
		query,
		req.Name,
		req.Description,
		projectID,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update project",
		})

		return
	}

	rowsAffected, _ := result.RowsAffected()

	if rowsAffected == 0 {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "not found",
		})

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"message": "project updated",
		},
	)
}

// DELETE /projects/:id
// Delete project
func DeleteProject(c *gin.Context) {

	projectID := c.Param("id")

	query := `
		DELETE FROM projects
		WHERE id = $1
	`

	result, err := database.DB.Exec(
		query,
		projectID,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete project",
		})

		return
	}

	rowsAffected, _ := result.RowsAffected()

	if rowsAffected == 0 {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "not found",
		})

		return
	}

	c.Status(
		http.StatusNoContent,
	)
}

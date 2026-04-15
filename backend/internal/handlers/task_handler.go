package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"taskflow/internal/database"
)

type Task struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      string     `json:"status"`
	Priority    string     `json:"priority"`
	ProjectID   string     `json:"project_id"`
	AssigneeID  *string    `json:"assignee_id"`
	DueDate     *time.Time `json:"due_date"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// GET /projects/:id/tasks
func GetTasks(c *gin.Context) {

	projectID := c.Param("id")

	status := c.Query("status")
	assignee := c.Query("assignee")

	query := `
	SELECT id, title, description, status, priority,
	       project_id, assignee_id,
	       due_date, created_at, updated_at
	FROM tasks
	WHERE project_id = $1
	`

	args := []interface{}{projectID}

	if status != "" {

		query += " AND status = $2"
		args = append(args, status)
	}

	if assignee != "" {

		query += " AND assignee_id = $3"
		args = append(args, assignee)
	}

	rows, err := database.DB.Query(
		query,
		args...,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch tasks",
		})

		return
	}

	defer rows.Close()

	var tasks []Task

	for rows.Next() {

		var t Task

		err := rows.Scan(
			&t.ID,
			&t.Title,
			&t.Description,
			&t.Status,
			&t.Priority,
			&t.ProjectID,
			&t.AssigneeID,
			&t.DueDate,
			&t.CreatedAt,
			&t.UpdatedAt,
		)

		if err == nil {
			tasks = append(tasks, t)
		}
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"tasks": tasks,
		},
	)
}

// POST /projects/:id/tasks
func CreateTask(c *gin.Context) {

	projectID := c.Param("id")

	var req Task

	if err := c.BindJSON(&req); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request",
		})

		return
	}

	if req.Title == "" {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "title is required",
		})

		return
	}

	taskID := uuid.New().String()

	query := `
	INSERT INTO tasks
	(id, title, description, status,
	 priority, project_id, assignee_id,
	 due_date, created_at, updated_at)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
	`

	now := time.Now()

	_, err := database.DB.Exec(
		query,
		taskID,
		req.Title,
		req.Description,
		req.Status,
		req.Priority,
		projectID,
		req.AssigneeID,
		req.DueDate,
		now,
		now,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create task",
		})

		return
	}

	c.JSON(
		http.StatusCreated,
		gin.H{
			"id": taskID,
		},
	)
}

// PATCH /tasks/:id
func UpdateTask(c *gin.Context) {

	taskID := c.Param("id")

	var req Task

	if err := c.BindJSON(&req); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request",
		})

		return
	}

	query := `
	UPDATE tasks
	SET title=$1,
	    description=$2,
	    status=$3,
	    priority=$4,
	    assignee_id=$5,
	    due_date=$6,
	    updated_at=$7
	WHERE id=$8
	`

	result, err := database.DB.Exec(
		query,
		req.Title,
		req.Description,
		req.Status,
		req.Priority,
		req.AssigneeID,
		req.DueDate,
		time.Now(),
		taskID,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update task",
		})

		return
	}

	rows, _ := result.RowsAffected()

	if rows == 0 {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "not found",
		})

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"message": "task updated",
		},
	)
}

// DELETE /tasks/:id
func DeleteTask(c *gin.Context) {

	taskID := c.Param("id")

	query := `
	DELETE FROM tasks
	WHERE id = $1
	`

	result, err := database.DB.Exec(
		query,
		taskID,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete task",
		})

		return
	}

	rows, _ := result.RowsAffected()

	if rows == 0 {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "not found",
		})

		return
	}

	c.Status(
		http.StatusNoContent,
	)
}

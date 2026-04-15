package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"taskflow/internal/config"
	"taskflow/internal/database"
	"taskflow/internal/handlers"
	"taskflow/internal/middleware"
)

func main() {

	// -------------------------
	// Load configuration
	// -------------------------

	cfg := config.LoadConfig()

	// -------------------------
	// Connect database
	// -------------------------

	database.Connect(cfg.DB_URL)

	// -------------------------
	// Create router
	// -------------------------

	router := gin.Default()

	// -------------------------
	// CORS Middleware (IMPORTANT)
	// -------------------------

	router.Use(cors.New(cors.Config{

		AllowOrigins: []string{
			"http://localhost:5173",
		},

		AllowMethods: []string{
			"GET",
			"POST",
			"PATCH",
			"DELETE",
			"OPTIONS",
		},

		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Authorization",
		},

		ExposeHeaders: []string{
			"Content-Length",
		},

		AllowCredentials: true,

		MaxAge: 12 * time.Hour,
	}))

	// Recommended security setting
	router.SetTrustedProxies(nil)

	// -------------------------
	// Health Check
	// -------------------------

	router.GET(
		"/health",
		func(c *gin.Context) {

			c.JSON(200, gin.H{
				"status": "ok",
			})

		},
	)

	// -------------------------
	// Auth Routes
	// -------------------------

	auth := router.Group("/auth")

	auth.POST(
		"/register",
		handlers.Register,
	)

	auth.POST(
		"/login",
		handlers.Login,
	)

	// -------------------------
	// Protected Routes
	// -------------------------

	protected := router.Group("/")

	protected.Use(
		middleware.AuthMiddleware(
			cfg.JWT_SECRET,
		),
	)

	// -------------------------
	// Project Routes
	// -------------------------

	protected.GET(
		"/projects",
		handlers.GetProjects,
	)

	protected.POST(
		"/projects",
		handlers.CreateProject,
	)

	protected.GET(
		"/projects/:id",
		handlers.GetProjectByID,
	)

	protected.PATCH(
		"/projects/:id",
		handlers.UpdateProject,
	)

	protected.DELETE(
		"/projects/:id",
		handlers.DeleteProject,
	)

	// -------------------------
	// Task Routes
	// -------------------------

	protected.GET(
		"/projects/:id/tasks",
		handlers.GetTasks,
	)

	protected.POST(
		"/projects/:id/tasks",
		handlers.CreateTask,
	)

	protected.PATCH(
		"/tasks/:id",
		handlers.UpdateTask,
	)

	protected.DELETE(
		"/tasks/:id",
		handlers.DeleteTask,
	)

	// -------------------------
	// Start Server
	// -------------------------

	log.Println(
		"Server running on port",
		cfg.PORT,
	)

	err := router.Run(":" + cfg.PORT)

	if err != nil {

		log.Fatal(
			"Failed to start server:",
			err,
		)

	}
}

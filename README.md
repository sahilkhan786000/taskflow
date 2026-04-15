# TaskFlow — Full Stack Project Management System

A modern full-stack **Task & Project Management System** built with:

* **Go (Gin)** backend
* **PostgreSQL** database
* **Docker** containerization
* **React** frontend
* **JWT Authentication**
* **Kanban Drag-and-Drop Board**
* **Glass UI with Dark/Light Theme**

This project demonstrates **real-world backend architecture**, **REST API design**, **Docker usage**, **authentication**, and **modern frontend UI patterns**.

---

# Demo Features

## Authentication

* User Registration
* User Login
* JWT-based authentication
* Protected routes

## Project Management

* Create project
* View projects
* Delete project
* Search projects
* Dashboard statistics

## Task Management

* Create task
* Update task status
* Delete task
* Priority management
* Kanban drag-and-drop board

## UI Features

* Glassmorphism design
* Dark / Light theme
* Responsive layout
* Toast notifications
* Loading skeletons
* Confirmation modals

---

# Tech Stack

## Backend

* Go (Golang)
* Gin Web Framework
* PostgreSQL
* JWT Authentication
* Docker

## Frontend

* React
* Tailwind CSS
* Framer Motion
* React Toastify
* Drag & Drop (Kanban)

## DevOps / Tools

* Docker
* Docker Compose
* PostgreSQL
* REST API
* Environment Variables

---

# System Architecture

```text
Frontend (React)

        ↓ API Calls

Backend (Go + Gin)

        ↓

PostgreSQL Database

        ↓

Docker Containers
```

---

# Project Structure

```bash
assignment/

├── backend/
│   ├── cmd/
│   │   └── main.go
│   │
│   ├── internal/
│   │   ├── config/
│   │   ├── database/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   └── models/
│   │
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_projects.sql
│   │   └── 003_create_tasks.sql
│   │
│   ├── go.mod
│   └── docker-compose.yml
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── ProjectDetail.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ThemeToggle.jsx
│   │   │
│   │   └── api/
│   │       └── api.js
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# API Endpoints

## Authentication

```
POST /auth/register
POST /auth/login
```

## Projects

```
GET    /projects
POST   /projects
GET    /projects/:id
DELETE /projects/:id
```

## Tasks

```
GET    /projects/:id/tasks
POST   /projects/:id/tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

---

# Environment Variables

Create the file:

```
backend/.env
```

Add:

```env
PORT=8080

DB_URL=postgres://postgres:password@localhost:5432/taskflow?sslmode=disable

JWT_SECRET=supersecretkey
```

---

# Running Project Locally (Without Docker)

## Step 1 — Start PostgreSQL

Install PostgreSQL locally or run using Docker.

---

## Step 2 — Run Backend

```bash
cd backend
go run cmd/main.go
```

Server runs on:

```
http://localhost:8080
```

---

## Step 3 — Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Running Project With Docker

This project uses **Docker** to run PostgreSQL in an isolated container.

---

## Start Database

```bash
docker compose up db
```

This will:

* Pull PostgreSQL image
* Create database container
* Expose port `5432`
* Persist database data

---

## Check Running Containers

```bash
docker ps
```

---

## Stop Containers

```bash
docker compose down
```

---

# Docker Concepts Used

## Container

A container is a lightweight runtime environment that runs an application.

Example:

```
postgres:15
```

This runs PostgreSQL inside Docker.

---

## Image

An image is a blueprint used to create containers.

Example:

```
postgres:15
```

Docker pulls this image from Docker Hub.

---

## Docker Compose

Docker Compose allows running multiple containers using a configuration file.

File used:

```
docker-compose.yml
```

---

## Volume

Volumes store persistent data outside the container.

Used for:

* PostgreSQL database storage

Example:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

This prevents data loss when the container stops.

---

## Port Mapping

Maps container port to the local machine.

Example:

```
5432:5432
```

Meaning:

```
Local machine → Container
```

---

## Network

Allows containers to communicate.

Example:

```
backend → database
```

---

# Docker Compose File

```yaml
services:

  db:
    image: postgres:15

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: taskflow

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

# Database Schema

## Users Table

* id
* name
* email
* password
* created_at

## Projects Table

* id
* name
* user_id
* created_at

## Tasks Table

* id
* title
* status
* priority
* project_id
* created_at

---

# Authentication Flow

```text
User Login
     ↓
Server verifies credentials
     ↓
JWT token generated
     ↓
Token stored in browser
     ↓
Token sent with every request
```

---

# Kanban Board Logic

Tasks are grouped by:

```
status
```

Possible values:

* todo
* in_progress
* done

Drag-and-drop updates status using:

```
PATCH /tasks/:id
```

---

# UI Features

* Dark / Light theme toggle
* Glassmorphism design
* Responsive layout
* Animated transitions
* Skeleton loading
* Toast notifications
* Confirmation modals
* Kanban drag and drop

---

# Security

* JWT Authentication
* Password hashing
* Protected routes
* Environment variables
* Input validation

---

# How Migrations Work

SQL migrations are stored in:

```
backend/migrations/
```

Run migrations using Docker:

```bash
docker run --rm \
-v C:\path\to\migrations:/migrations \
migrate/migrate \
-path=/migrations \
-database "postgres://postgres:password@host.docker.internal:5432/taskflow?sslmode=disable" \
up
```

This command creates the required database tables.

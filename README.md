\section{TaskFlow — Full Stack Project Management System}

A modern full-stack \textbf{Task & Project Management System} built with:

\begin{itemize}
\item Go (Gin) backend
\item PostgreSQL database
\item Docker containerization
\item React frontend
\item JWT Authentication
\item Kanban Drag-and-Drop Board
\item Glass UI with Dark/Light Theme
\end{itemize}

This project demonstrates real-world backend architecture, REST API design, Docker usage, authentication, and modern frontend UI patterns.

\section{Demo Features}

\subsection{Authentication}

\begin{itemize}
\item User Registration
\item User Login
\item JWT-based authentication
\item Protected routes
\end{itemize}

\subsection{Project Management}

\begin{itemize}
\item Create project
\item View projects
\item Delete project
\item Search projects
\item Dashboard statistics
\end{itemize}

\subsection{Task Management}

\begin{itemize}
\item Create task
\item Update task status
\item Delete task
\item Priority management
\item Kanban drag-and-drop board
\end{itemize}

\subsection{UI Features}

\begin{itemize}
\item Glassmorphism design
\item Dark / Light theme
\item Responsive layout
\item Toast notifications
\item Loading skeletons
\item Confirmation modals
\end{itemize}

\section{Tech Stack}

\subsection{Backend}

\begin{itemize}
\item Go (Golang)
\item Gin Web Framework
\item PostgreSQL
\item JWT Authentication
\item Docker
\end{itemize}

\subsection{Frontend}

\begin{itemize}
\item React
\item Tailwind CSS
\item Framer Motion
\item React Toastify
\item Drag & Drop (Kanban)
\end{itemize}

\subsection{DevOps / Tools}

\begin{itemize}
\item Docker
\item Docker Compose
\item PostgreSQL
\item REST API
\item Environment Variables
\end{itemize}

\section{System Architecture}

\begin{center}

Frontend (React)

$\downarrow$ API Calls

Backend (Go + Gin)

$\downarrow$

PostgreSQL Database

$\downarrow$

Docker Containers

\end{center}

\section{Project Structure}

\begin{verbatim}
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
\end{verbatim}



CREATE TYPE task_status AS ENUM (
    'todo',
    'in_progress',
    'done'
);

CREATE TYPE task_priority AS ENUM (
    'low',
    'medium',
    'high'
);

CREATE TABLE tasks (

    id UUID PRIMARY KEY,

    title TEXT NOT NULL,

    description TEXT,

    status task_status DEFAULT 'todo',

    priority task_priority DEFAULT 'medium',

    project_id UUID REFERENCES projects(id)
        ON DELETE CASCADE,

    assignee_id UUID REFERENCES users(id),

    due_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
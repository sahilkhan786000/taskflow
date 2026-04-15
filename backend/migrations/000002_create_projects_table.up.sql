CREATE TABLE projects (

    id UUID PRIMARY KEY,

    name TEXT NOT NULL,

    description TEXT,

    owner_id UUID REFERENCES users(id)
        ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
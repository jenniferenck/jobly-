CREATE TABLE companies
(
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees INTEGER,
    description text,
    logo_url text
);

CREATE TABLE jobs
(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT NOT NULL, 
    equity FLOAT NOT NULL CHECK (equity >= 0 and equity <= 1), 
    company_handle text,
    date_posted TIMESTAMP NOT NULL,
    FOREIGN KEY (company_handle) REFERENCES companies(handle) ON DELETE CASCADE
);

CREATE TABLE users 
(
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE NOT NULL,
    photo_url text,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL 
)
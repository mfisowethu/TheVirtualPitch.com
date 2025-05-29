# Blog Database Schema

This document outlines the database structure for the blog application.

## Tables

### 1. Users
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR(50), UNIQUE, NOT NULL)
- `password` (VARCHAR(255), NOT NULL) - Store hashed passwords in production
- `email` (VARCHAR(100), UNIQUE, NOT NULL)
- `role` (ENUM('admin', 'editor', 'author'), DEFAULT 'author')
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

### 2. Posts
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `title` (VARCHAR(255), NOT NULL)
- `slug` (VARCHAR(255), UNIQUE, NOT NULL) - URL-friendly version of title
- `content` (TEXT, NOT NULL)
- `excerpt` (TEXT) - Short summary for listings
- `featured_image` (VARCHAR(255)) - Path to featured image
- `featured` (BOOLEAN, DEFAULT FALSE) - Whether post is featured
- `status` (ENUM('draft', 'published', 'archived'), DEFAULT 'draft')
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id))
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
- `published_at` (TIMESTAMP) - When the post was published

### 3. Categories
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(50), UNIQUE, NOT NULL)
- `slug` (VARCHAR(50), UNIQUE, NOT NULL)
- `description` (TEXT)

### 4. Post_Category (Many-to-Many Relationship)
- `post_id` (INT, FOREIGN KEY REFERENCES Posts(id))
- `category_id` (INT, FOREIGN KEY REFERENCES Categories(id))
- PRIMARY KEY (post_id, category_id)

### 5. Tags
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(50), UNIQUE, NOT NULL)
- `slug` (VARCHAR(50), UNIQUE, NOT NULL)

### 6. Post_Tag (Many-to-Many Relationship)
- `post_id` (INT, FOREIGN KEY REFERENCES Posts(id))
- `tag_id` (INT, FOREIGN KEY REFERENCES Tags(id))
- PRIMARY KEY (post_id, tag_id)

### 7. Comments
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `post_id` (INT, FOREIGN KEY REFERENCES Posts(id))
- `user_id` (INT, FOREIGN KEY REFERENCES Users(id), NULL) - If comment by registered user
- `name` (VARCHAR(100)) - For guest comments
- `email` (VARCHAR(100)) - For guest comments
- `content` (TEXT, NOT NULL)
- `status` (ENUM('pending', 'approved', 'spam'), DEFAULT 'pending')
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## Sample SQL for MySQL

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'editor', 'author') DEFAULT 'author',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create other tables similarly
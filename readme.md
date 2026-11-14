# 🎵 Music Playlists API - TypeScript & GraphQL

REST API for managing music playlists. CSE 341 Project - BYU-Idaho.

## 📋 Description

This API allows users to manage music playlists. It includes a complete CRUD system with GET, POST, PUT, and DELETE endpoints for both playlists and users. It also features **OAuth 2.0 authentication** (GitHub and Google), data validation, error handling, and auto-generated Swagger documentation. The entire backend is built with **TypeScript** and follows a **Service Layer** architecture. It also includes a **GraphQL** endpoint (Extra Credit).

## 🚀 Technologies

- **Node.js** & **Express 5**
- **TypeScript**
- **Apollo Server (GraphQL)**
- **MongoDB** & **Mongoose 9**
- **Passport.js** (OAuth with GitHub and Google)
- **Swagger** (`swagger-autogen` + `swagger-ui-express`)
- **bcryptjs** (for password hashing)
- **express-validator** (for data validation)
- **Helmet** & **CORS** (for security)
- **dotenv** (for environment variables)
- **Jest** & **Supertest** (for testing)
- **GitHub Actions** (for CI/CD)
- **Docker** & **Docker Compose** (for containerization)

## 🗄️ Database

The project uses **MongoDB Atlas** as the database, connected via Mongoose.

### Collections

| Collection  | Description                             | Fields                                                         |
| :---------- | :-------------------------------------- | :------------------------------------------------------------- |
| `users`     | Stores user accounts (local and OAuth). | name, email, password (hashed), role, provider                 |
| `playlists` | Stores music playlists.                 | name, description, creator, genre, songs, isPublic, coverImage |

The `playlists` collection contains **8 fields**, meeting the project requirement of at least 7 fields. The `users` collection stores credentials securely using `bcrypt` for local users, while OAuth users are identified by their provider.

## 🏗️ Architecture

The project follows a **Service Layer** pattern:

- `controllers/`: Handle HTTP requests and responses.
- `services/`: Contain all business logic and database queries (reusable by REST and GraphQL).
- `models/`: Mongoose schemas and interfaces.
- `routes/`: Define API endpoints.
- `graphql/`: Apollo Server type definitions and resolvers.

## 🧪 Testing & CI/CD

- **Unit Tests:** Run `npm test` to execute Jest tests for the API.
- **Continuous Integration:** A GitHub Actions workflow (`.github/workflows/ci.yml`) runs the linter, tests, and build on every push to `main`.

## 🐳 Docker

The project is fully containerized. You can run the API and MongoDB together using Docker Compose.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Run with Docker

1.  Make sure you have a `.env` file with your environment variables (see below).
2.  Build and start the containers:
    ```bash
    docker compose up --build

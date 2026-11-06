# 🎵 Music Playlists API

REST API for managing music playlists. CSE 341 Project - BYU-Idaho.

## 📋 Description

This API allows users to manage music playlists. It includes a complete CRUD system with GET, POST, PUT, and DELETE endpoints for both playlists and users. It also features **OAuth 2.0 authentication** (GitHub and Google), data validation, error handling, and auto-generated Swagger documentation.

## 🚀 Technologies

- **Node.js** & **Express 5**
- **MongoDB** & **Mongoose 9**
- **Passport.js** (OAuth with GitHub and Google)
- **Swagger** (`swagger-autogen` + `swagger-ui-express`)
- **bcryptjs** (for password hashing)
- **express-validator** (for data validation)
- **Helmet** & **CORS** (for security)
- **dotenv** (for environment variables)

## 🗄️ Database

The project uses **MongoDB Atlas** as the database, connected via Mongoose.

### Collections
| Collection | Description | Fields |
| :--- | :--- | :--- |
| `users` | Stores user accounts (local and OAuth). | name, email, password (hashed), role, provider |
| `playlists` | Stores music playlists. | name, description, creator, genre, songs, isPublic, coverImage |

The `playlists` collection contains **8 fields**, meeting the project requirement of at least 7 fields. The `users` collection stores credentials securely using `bcrypt` for local users, while OAuth users are identified by their provider.

## 🛠️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Jesustortoleroh/cse341-music-playlists.git
   cd cse341-music-playlists
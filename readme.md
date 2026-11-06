# 🎵 Music Playlists API - TypeScript & GraphQL

This is the **Extra Credit** version of my CSE 341 project. It includes two advanced features:
1.  **TypeScript:** The entire backend is written in `.ts` with strict typing (no `.js` files).
2.  **GraphQL:** REST is replaced by Apollo Server, providing a single `/graphql` endpoint.

## 🗄️ Database

This project uses **MongoDB Atlas** as the database. The connection is established via Mongoose.

### Collections
| Collection | Description | Fields |
| :--- | :--- | :--- |
| `users` | Stores user accounts (local and OAuth). | name, email, password (hashed), role, provider |
| `playlists` | Stores music playlists. | name, description, creator, genre, songs, isPublic, coverImage |

The `playlists` collection is the primary collection and contains **8 fields**, meeting the project requirement of at least 7 fields. The `users` collection stores credentials securely using `bcrypt` for local users, while OAuth users are identified by their provider.

## 🚀 Live Demo
- **GraphQL Sandbox:** [https://cse341-music-playlists-ts.onrender.com/graphql](https://cse341-music-playlists-ts.onrender.com/graphql)

## 🛠️ How to Run Locally

1. Clone the repository and switch to the correct branch:
   ```bash
   git clone https://github.com/Jesustortoleroh/cse341-music-playlists.git
   cd cse341-music-playlists
   git checkout extra-typescript-graphql

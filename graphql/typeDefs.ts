export const typeDefs = `#graphql
  type Playlist {
    _id: ID!
    name: String!
    description: String
    creator: String!
    genre: String!
    songs: [String]
    isPublic: Boolean
    coverImage: String
    createdAt: String
    updatedAt: String
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    provider: String
    createdAt: String
    updatedAt: String
  }

  input PlaylistInput {
    name: String!
    description: String
    creator: String!
    genre: String!
    songs: [String]
    isPublic: Boolean
    coverImage: String
  }

  input PlaylistUpdateInput {
    name: String
    description: String
    creator: String
    genre: String
    songs: [String]
    isPublic: Boolean
    coverImage: String
  }

  type Query {
    playlists: [Playlist]
    playlist(id: ID!): Playlist
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createPlaylist(input: PlaylistInput!): Playlist
    updatePlaylist(id: ID!, input: PlaylistUpdateInput!): Playlist
    deletePlaylist(id: ID!): Boolean
  }
`;
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    userPosts: [Listing]
    savedFavorites: [Listing]
  }

  type Listing {
    _id: ID!
    description: String
    address: String
    dateOfSale: String
    images: [String]
    author: String
    title: String
    lat: Float
    lng: Float
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    me: User
    allUsers: [User]
    allListings: [Listing]
    listing(listingId: ID!): Listing
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    updateUsername(newUsername: String!): User
    updatePassword(email:String!, currentPassword:String!, newPassword: String!): User
    addListing(description: String, address: String, dateOfSale: String, images: [String], title: String, lat: Float, lng: Float): Listing
    editListing(id: ID, description: String, address: String, dateOfSale: String, images: [String], title: String, lat: Float, lng: Float): Listing
    removeListing(listingId: ID!): Listing
    addFavorites(listingId: ID!): Listing
    removeFavorites(listingId: ID!): Listing
  }
`;

module.exports = typeDefs;

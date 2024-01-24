const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    address: String!
    email: String!
    userRequests: [Request]
    totalUserRequests: Int!
    activeUserRequests: Int!
    canceledUserRequests: Int!
    completedUserRequests: Int!
  }

  type Request {
    _id: ID!
    requestNumber: Int!
    type: String!
    status: String!
    date: String!
    address: String!
    images: [String]
    createdBy: String!
  }

  type RequestTotals {
    _id: String!
    totalRequests: Int!
    activeRequests: Int!
    canceledRequests: Int!
    completedRequests: Int!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    me: User
    allUsers: [User]
    allRequests: [Request]
    request(requestId: ID!): Request
    requestTotals: RequestTotals
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Auth
    updatePassword(
      email: String!
      currentPassword: String!
      newPassword: String!
    ): User
  }
`;

module.exports = typeDefs;

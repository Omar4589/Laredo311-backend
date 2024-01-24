const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    lastName: String!
    email: String!
    userRequests: [Request]
    totalUserRequests: Number!
    activeUserRequests: Number!
    canceledUserRequests: Number!
    completedUserRequests: Number!
  }

  type Request {
    _id: ID!
    number: Number!
    type: String!
    status: String!
    date: String!
    address: String!
    images: [String]
    createdBy: String!
  }

  type RequestTotals {
    _id: ID!
    totalRequests: Number!
    activeRequests: Number!
    canceledRequests: Number!
    completedRequests: Number!
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
`;

module.exports = typeDefs;

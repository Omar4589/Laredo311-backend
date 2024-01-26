const { AuthenticationError } = require("apollo-server-express");

const { User, Request, RequestTotals } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        const me = await User.findById({ _id: context.user._id }).populate(
          "userRequests"
        );
        return me;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    allUsers: async () => {
      return await User.find().populate("userRequests");
    },
    allRequests: async () => {
      return await Request.find();
    },
    singleRequest: async (parent, { requestId }) => {
      return await Request.findOne({ _id: requestId });
    },
    requestTotals: async (parent) => {
      return await RequestTotals.findOne({ _id: "requestTotal956" });
    },
  },
  Mutation: {
    // create a user, sign a token, and send it back
    createUser: async (parent, { firstName, lastName, email, password }) => {
      const user = await User.create({ firstName, lastName, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // login a user, sign a token, and send it back
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError("Incorrect email or password!");
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError("Incorrect email or password!");
        }
        const token = signToken(user);
        return { token, user };
      } catch (e) {
        //this if statement check if the error we catch is an instance of an auth error..
        if (e instanceof AuthenticationError) {
          throw e; // Rethrow the authentication-related errors
        }
        //if any other type of error, we throw a new auth error..
        throw new AuthenticationError(
          "An unexpected error occured. Error code: 956"
        );
      }
    },
    updatePassword: async (
      parent,
      { email, currentPassword, newPassword },
      context
    ) => {
      if (context.user) {
        const user = await User.findOne({ email });

        const correctPw = await user.isCorrectPassword(currentPassword);
        if (!correctPw) {
          throw new AuthenticationError("Incorrect password!");
        }

        // Update the password field
        user.password = newPassword;

        // Explicitly save the user to trigger the pre-save hook for hashing the password
        await user.save();

        return user;
      }
      throw new AuthenticationError(
        "Something went wrong while trying to update a password!"
      );
    },
    createRequest: async (
      parent,
      { requestNumber, type, status, date, author, address, images, createdBy },
      context
    ) => {
      if (context.user) {
        const request = await Request.findOne({ requestNumber });
        if (request) {
          throw new Error("This request number already exists.");
        }
        const newRequest = await Request.create({
          requestNumber,
          type,
          status,
          date,
          author,
          address,
          images,
          createdBy,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $push: { userRequests: newRequest._id },
            $inc: { totalUserRequests: 1, activeUserRequests: 1 }, //this operator increments the value
          },
          { new: true }
        );
        await RequestTotals.findByIdAndUpdate(
          { _id: "requestTotal956" },
          { $inc: { totalRequests: 1, activeRequests: 1 } }
        );
        return newRequest;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    cancelRequest: async (parent, { requestId }, context) => {
      if (context.user) {
        const request = await Request.findById(requestId);

        if (!request) {
          throw new Error("Request not found"); // or handle it as per your application's error handling strategy
        }

        if (request.status === "canceled") {
          throw new Error("Request has already been canceled"); // Return a message or handle as needed
        } else {
          const canceledRequest = await Request.findOneAndUpdate(
            { _id: requestId },
            { status: "canceled" },
            { new: true }
          );

          await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $inc: { activeUserRequests: -1, canceledUserRequests: 1 },
            }
          );
          await RequestTotals.findByIdAndUpdate(
            { _id: "requestTotal956" },
            { $inc: { activeRequests: -1, canceledRequests: 1 } }
          );
          return canceledRequest;
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    completeRequest: async (parent, { requestId }, context) => {
      if (context.user) {
        const request = await Request.findById(requestId);
        if (!request) {
          throw new Error("Request number not found.");
        }

        if (request.status === "completed") {
          throw new Error("Request has already been completed"); // Return a message or handle as needed
        } else {
          const completedRequest = await Request.findOneAndUpdate(
            { _id: requestId },
            { status: "completed" },
            { new: true }
          );
          await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $inc: {
                activeUserRequests: -1,
                completedUserRequests: 1,
              },
            }
          );
          return completedRequest;
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;

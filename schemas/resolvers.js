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
    request: async (parent, { requestId }) => {
      return await Request.findOne({ _id: requestId });
    },
    requestTotals: async (parent) => {
      return await RequestTotals.find();
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
  },
};

module.exports = resolvers;

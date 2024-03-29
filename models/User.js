const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please your first name."],
      trim: true,
      maxlength: [25, "The name you entered is too long, please try again."],
    },
    lastName: {
      type: String,
      required: [true, "Please your last name."],
      trim: true,
      maxlength: [25, "The name you entered is too long, please try again."],
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [
        8,
        "Please enter a password that contains 8 or more characters",
      ],
      maxlength: [32, "Password must not be more than 32 characters"],
    },
    userRequests: [
      {
        // referrances the Request table to the id
        type: Schema.Types.ObjectId,
        ref: "Request",
      },
    ],
    totalUserRequests: {
      type: Number,
      required: true,
      default: 0,
    },
    activeUserRequests: {
      type: Number,
      required: true,
      default: 0,
    },
    canceledUserRequests: {
      type: Number,
      required: true,
      default: 0,
    },
    completedUserRequests: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// hash user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;

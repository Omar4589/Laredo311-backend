const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const requestSchema = new Schema(
  {
    number: {
      type: Number,
      required,
      minlength: 1,
      maxlength: 1000,
      trim: true,
    },
    type: {
      type: String,
      required: [true, "A request type is needed."],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "A request status is needed."],
      trim: true,
      default: "active",
    },
    // date to hold the sell for buyers
    date: {
      type: String,
      required: [true, "Enter a date"],
    },
    address: {
      type: String,
      required,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: [String],
      required: [true, "the 'createdBy' field is required"],
    },
  },
  { timestamps: true }
);

const Request = model("Request", requestSchema);

module.exports = Request;

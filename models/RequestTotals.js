const { Schema, model } = require("mongoose");

const requestTotalsSchema = new Schema({
  _id: {
    type: String,
  },
  totalRequests: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 1000,
    trim: true,
  },
  activeRequests: {
    type: Number,
    required: true,
    maxlength: 1000,
    trim: true,
  },
  canceledRequests: {
    type: Number,
    required: true,
    maxlength: 1000,
    trim: true,
  },
  completedRequests: {
    type: Number,
    required: true,
    maxlength: 1000,
    trim: true,
  },
});

const RequestTotals = model("RequestTotals", requestTotalsSchema);

module.exports = RequestTotals;

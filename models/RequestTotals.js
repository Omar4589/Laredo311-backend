const { Schema, model } = require("mongoose");

const requestTotalsSchema = new Schema({
  totalRequests: {
    type: Number,
    required,
    minlength: 1,
    maxlength: 1000,
    trim: true,
  },
  activeRequests: {
    type: Number,
    required,
    maxlength: 1000,
    trim: true,
  },
  canceledRequests: {
    type: Number,
    required,
    maxlength: 1000,
    trim: true,
  },
  completedRequests: {
    type: Number,
    required,
    maxlength: 1000,
    trim: true,
  },
});

const RequestTotals = model("RequestTotals", requestSchema);

module.exports = RequestTotals;

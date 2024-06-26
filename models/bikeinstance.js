//bikeinstance.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BikeInstanceSchema = new Schema({
  bike: { type: Schema.Types.ObjectId, ref: "Bike", required: true },
  size: {
    type: String,
    enum: [
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "S/M",
      "M/L",
      "L/XL",
      "XL/XXL",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Unavailable", "Ask for availability"],
    default: "Available",
    required: true,
  },
});

// Virtual for categories URL
BikeInstanceSchema.virtual("url").get(function () {
  return `/catalog/bikeinstance/${this._id}`;
});

module.exports = mongoose.model("BikeInstance", BikeInstanceSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Listing = new Schema({
  title: { type: String, required: true },
  userId: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  type: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: String, required: true },
  bedrooms: { type: String, required: true },
  toilets: { type: String, required: true },
  bathrooms: { type: String, required: true },
  Furnished: { type: String },
  Serviced: { type: String },
  parking: { type: String },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Listing", Listing);

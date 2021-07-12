const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Request = new Schema({
  userId: String,
  location: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  category: { type: String, required: true },
  area: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: String, required: true },
  bedrooms: { type: String, required: true },
});

module.exports = mongoose.model("Request", Request);

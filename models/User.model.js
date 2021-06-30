const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = new Schema(
  {
    name: {
      type: String,
      required: [true, "please add a message"],
      trim: true,
      maxlength: [50, "cant be more that 50 chracters"],
    },
    slug: String,
    email: {
      type: String,
      required: [true, "please add a message"],
      unique: true,
      trim: true,
      maxlength: [50, "cant be more that 50 chracters"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please input a valid mail",
      ],
    },
    craft: {
      type: String,
      required: [true, "please add a message"],
      trim: true,
      maxlength: [50, "cant be more that 50 chracters"],
    },
    password: {
      type: String,
      required: [true, "please add a message"],
      trim: true,
      minlength: [8, "Must be more than 8 Characters"],
      select: false,
    },
    // Phone Number
    // Address One
    //about me
    // savedListings
    resetPasswordToke: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    listing: {
      type: mongoose.Schema.ObjectId,
      ref: "listing",
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

User.virtual("samples", {
  ref: "sample",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});
User.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
User.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
User.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", User);

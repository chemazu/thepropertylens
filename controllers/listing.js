const { query } = require("express");
const path = require("path");
const asyncHandler = require("../middleware/async");
const Listing = require("../models/Listing.model");
const ErrorResponse = require("../utils/errorResponse");

//add Listing
//route: "post" /add
//access : private
exports.addListing = async (req, res, next) => {
  const listing = JSON.parse(req.body.listing);
  const { images } = listing;
  if (req.files === null) {
    return next(new ErrorResponse(`Please upload a file`, 404));
  }
  //SETTING THUMBNAIL
  const { thumbnail } = req.files;
  console.log(thumbnail);
  thumbnailName = `${thumbnail.md5}${thumbnail.name.split(" ").join("_")}`;
  thumbnail.mv(
    `${process.env.FILE_UPLOAD_PATH}/${thumbnailName}`,
    async (err) => {
      if (err) {
        new ErrorResponse(`Error Uploading ${err}`, 404);
      }
    }
  );
  listing.thumbnail = thumbnailName;
  console.log(listing.thumbnail);
  //SETTING GALLERY
  let { file } = req.files;
  file.map((item) => {
    if (!item.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image`, 404));
    }
    if (item.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          404
        )
      );
    }
    item.name = `${item.md5}${item.name.split(" ").join("_")}`;
    images.push(item.name);
    item.mv(`${process.env.FILE_UPLOAD_PATH}/${item.name}`, async (err) => {
      if (err) {
        new ErrorResponse(`Error Uploading ${err}`, 404);
      }
    });
  });
  try {
    console.log(listing);
    const newListing = await Listing.create(listing);
    if (!newListing) {
      return next(new ErrorResponse(`Error in creating new Listing`, 500));
    }
    res.status(201).json({ success: true, data: newListing });
  } catch (error) {
    return next(
      new ErrorResponse(`Error in creating new Listing ${error.message}`, 500)
    );
  }
};
//view all Listing
//route: "get" /listings
//access : public
//get multiple listings, buy user,type,status...

const handleRequest = async (value) => {
  console.log(value);
  const rice = await Listing.find({ status: value });
  return rice;
};
exports.getListings = async (req, res, next) => {
  try {
    //featured, rent, buy
    if (req.params.id === "buy") {
      const fish = await handleRequest("sale");
      return res.status(200).json({
        success: true,
        count: fish.length,
        data: fish,
      });
    }
    if (req.params.id === "rent" || "featured") {
      const fish = await handleRequest(req.params.id);
      return res.status(200).json({
        success: true,
        count: fish.length,
        data: fish,
      });
    } else {
      const fish = await Listing.find({ userId: req.params.id });
      return res.status(200).json({
        success: true,
        count: fish.length,
        data: fish,
      });
    }
  } catch (error) {
    console.log(error);
    next(new ErrorResponse(`No Sample found with id of ${req.params.id}`, 404));
  }
};

//view listing by id
//route: "get" /listing/:id
//get a single lisitng
//access : public
exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(
        new ErrorResponse(`No Listing found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(
      new ErrorResponse(`No listing found with id of ${req.params.id}`, 404)
    );
  }
};

//update Listing
//route: "put" /update/:id
//access : private

exports.updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!listing) {
      return next(
        new ErrorResponse(`No Listing found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: listing });
    next();
  } catch (error) {
    next(
      new ErrorResponse(`No Listing found with id of ${req.params.id}`, 404)
    );
  }
};

//delete by id
//route: "put" /delete/:id
//access : private

exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return next(
        new ErrorResponse(`No Listing found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: "deleted{}" });
    next();
  } catch (error) {
    next(
      new ErrorResponse(`No listing found with id of ${req.params.id}`, 404)
    );
  }
};

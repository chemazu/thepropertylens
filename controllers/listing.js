const Listing = require("../models/Listing.model");
const ErrorResponse = require("../utils/errorResponse");

//add Listing
//route: "post" /add
//access : private

exports.addListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    if (!newListing) {
      return next(new ErrorResponse(`Error in creating new Listing`, 500));
    }
    res.status(201).json({ success: true, data: newListing });
  } catch (error) {
    next(new ErrorResponse(`Error in creating new Listing`, 500));
  }
  next();
};
//view all Listing
//route: "get" /listings
//access : private

exports.getListings = async (req, res, next) => {
  const reqQuery = { ...req.query }; //query can be gotten after you put a ?... ie ?select=rg,the first query starts with ? and subsequent ones have&
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);
  let query;
  query = Listing.find(reqQuery);
  //select
  //selects what fields will be returned by the json file
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //sort by
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  //pagination
  const page = parseInt(req.query.page, 10) || 1; //page is passed as a string
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit; // the way i understand this, it skips a certain amount of docs, eg. on page 3 of  with limit 10, they will skip 20 docs((3-1)X10), ie 10 for page 1, and another 10 for page 2
  const endIndex = page * limit; //this is to get prev and next
  total = await Listing.countDocuments();
  query = query.skip(startIndex).limit(limit);

  //populate
  // if (populate) {
  //   query = query.populate(populate);
  // }
  const result = await query;
  const pagination = {};
  //pagination results
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit: limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit: limit };
  }
  // res.advancedResults = {
  //   success: true,
  //   count: result.length,
  //   pagination,
  //   data: result,
  // };
  res
    .status(200)
    .json({ success: true, count: result.length, pagination, data: result });
  //   next(new ErrorResponse(`No Sample found with id of ${req.params.id}`, 404));
  next();
};
//view listing by id
//route: "get" /listing/:id
//access : private

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

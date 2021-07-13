const path = require("path");
const Listing = require("../models/Listing.model");
const ErrorResponse = require("../utils/errorResponse");

//add Listing
//route: "post" /add
//access : private
exports.addListing = async (req, res, next) => {
  const reqListing = JSON.parse(req.body.listing);
  console.log(reqListing);
  const { images } = reqListing;
  const { file } = req.files;
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 404));
  }
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
        console.log(err);
      }
    });
  });
  try {
    const newListing = await Listing.create(reqListing);
    if (!newListing) {
      return next(new ErrorResponse(`Error in creating new Listing`, 500));
    }
    res.status(201).json({ success: true, data: newListing });
  } catch (error) {
    next(new ErrorResponse(`Error in creating new Listing`, 500));
  }
};

//view all Listing
//route: "get" /listings
//access : private

exports.getListings = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query }; //query can be gotten after you put a ?... ie ?select=rg,the first query starts with ? and subsequent ones have&
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    let query;
    console.log(reqQuery);
    console.log(req.params.id);
    if (req.params.id === "rent") {
      query = Listing.find({ status: "For Rent" }); //here is where to modify
      console.log(query);
    }
    if (req.params.id === "featured") {
      query = Listing.find({ status: "For Featured" }); //here is where to modify
      console.log(query);
    }
    if (req.params.id === "buy") {
      query = Listing.find({ status: "For Sale" }); //here is where to modify
      console.log(query);
    }
    //featured
    //sale
    if (req.params.id === "rent") {
      query = Listing.find({ status: "For Rent" }); //here is where to modify
      console.log(query);
    } else {
      query = Listing.find({ userId: req.params.id });
    } //here is where to modify
    // query = Listing.find({ address: "fish" }); //here is where to modify

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
    res
      .status(200)
      .json({ success: true, count: result.length, pagination, data: result });
    //   next(new ErrorResponse(`No Sample found with id of ${req.params.id}`, 404));
    next();
  } catch (error) {
    console.log(error);
  }
};
//getMylistings
exports.getMyListings = async (req, res, next) => {
  eggs = await Listing.find({ userId: req.params.id });
  console.log(eggs);
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

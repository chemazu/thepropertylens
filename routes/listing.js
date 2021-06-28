const { Router } = require("express");
const {
  addListing,
  updateListing,
  deleteListing,
  getListing,
  getListings,
  photoUpload,
} = require("../controllers/listing");
const Listing = require("../models/Listing.model");
const router = Router();

router.post("/add", addListing);
router.put("/update/:id", updateListing);
router.delete("/delete/:id", deleteListing);
router.get("/listing/:id", getListing);
router.get("/listings", getListings);
router.post("/upload/:id", photoUpload);

module.exports = router;

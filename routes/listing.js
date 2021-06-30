const { Router } = require("express");
const {
  addListing,
  updateListing,
  deleteListing,
  getListing,
  getListings,
  getMyListings,
} = require("../controllers/listing");
const Listing = require("../models/Listing.model");
const router = Router();

router.post("/add", addListing);
router.put("/update/:id", updateListing);
router.delete("/delete/:id", deleteListing);
router.get("/listing/:id", getListing);
router.get("/listings/:id", getListings);

module.exports = router;

const { Router } = require("express");
const { protect } = require("../middleware/auth");

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
router.get("/listing/:id", protect, getListing);
router.get("/listings/:id", getListings); //my listing

module.exports = router;

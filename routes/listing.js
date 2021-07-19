const { Router } = require("express");
const { protect } = require("../middleware/auth");

const {
  addListing,
  updateListing,
  deleteListing,
  getListing,
  getListings,
  addListing2,
} = require("../controllers/listing");
const Listing = require("../models/Listing.model");
const router = Router();

router.post("/add", addListing);
// router.post("/add2", addListing2);
router.put("/update/:id", updateListing);
router.delete("/delete/:id", deleteListing);
router.get("/listing/:id", getListing);
router.get("/listings/:id", getListings); //my listing

module.exports = router;

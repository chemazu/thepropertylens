const { Router } = require("express");
const { protect } = require("../middleware/auth");
const router = Router();

const { addRequest, getRequests } = require("../controllers/request");

router.post("/add", addRequest);
router.get("/requests", getRequests);
module.exports = router;

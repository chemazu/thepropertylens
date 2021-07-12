const { Router } = require("express");
const { protect } = require("../middleware/auth");
const router = Router();

const { addRequest } = require("../controllers/request");

router.post("/add", addRequest);
module.exports = router;

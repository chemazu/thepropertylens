const { Router } = require("express");
const { register, login, getUser, updateUser } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", protect, getUser);
router.put("/updateuser/:id", updateUser);
module.exports = router;

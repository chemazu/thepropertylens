const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("./error");
const User = require("../models/User.model");

//protect routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }
  //make sure token is sent
  if (!token) {
    // return next(new ErrorResponse("not authorized to acess this route,", 401));
    console.log("not authorized to acess this route");
    // next();
    return res
      .status(200)
      .json({ success: false, message: "not authorized to acess this route" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    // return next(new ErrorResponse("not authorized to acess this route,", 401));
    res.status(200).json({
      success: false,
      message: "not authorized to acess this route",
      error,
    });
  }
});

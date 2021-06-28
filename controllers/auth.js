const User = require("../models/User.model");
const ErrorResponse = require("../utils/errorResponse");
exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    //Create token
    const token = newUser.getSignedJwtToken();
    res.status(200).json({ success: "true", token });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  //Create token
  const token = user.getSignedJwtToken();

  //match password

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    next(new ErrorResponse("invalid credentials password", 401));
  }

  // res.status(200).json({ success: "true", token });
  sendTokenResponse(user, 200, res);
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

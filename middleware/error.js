const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (error, req, res, next) => {
  let err = { ...error };
  err.message = error.message;
  if (error.name === "CastError") {
    const message = `Resource not found with id of ${error.value}`;
    err = new ErrorResponse(message, 404);
  }
  if (error.code === 11000) {
    const message = `${Object.entries(error.keyValue)}, already exists`;
    console.log("error probs duplicate", message);
    err = new ErrorResponse(message, 404);
    // Object.entries(error.keyValue)[0][1]; // someVal
  }
  res
    .status(err.statusCode || 500)
    .json({ success: false, error: err.message, status: error });
  next();
};
module.exports = errorHandler;

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
    err = new ErrorResponse(message, 404);
    // Object.entries(error.keyValue)[0][1]; // someVal
  }
  console.lo;
  res
    .status(err.statusCode || 500)
    .json({ success: false, error: err.message, stuff: error });
  next();
};
module.exports = errorHandler;

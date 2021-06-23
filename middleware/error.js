const errorHandler = (error, req, res, next) => {
  console.log(error.stack);
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "server error" });
  next();
};
module.exports = errorHandler;

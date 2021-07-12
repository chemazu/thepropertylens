const ErrorResponse = require("../utils/errorResponse");
const Request = require("../models/Request.model");

//add Request
//route: "post" /add
//access : public

exports.addRequest = async (req, res, next) => {
  try {
    const newRequest = await Request.create(req.body);
    if (!newRequest) {
      return next(new ErrorResponse(`Error in creating new Request`, 500));
    }
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    next(new ErrorResponse(`Error in creating new Request`, 500));
  }
};

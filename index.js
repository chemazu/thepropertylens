const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/error");

dotenv.config();
app.use(cors());
app.use(express.json());

// connect to database
const db = process.env.mongoURI;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("mongodb running"))
  .catch((err) => {
    console.log("the error is", err);
  });

//routes
app.use("/listing", require("./routes/listing"));
app.use(errorHandler);
//file upload
app.listen(PORT, () => {
  console.log(`currently running on ${PORT}`);
});

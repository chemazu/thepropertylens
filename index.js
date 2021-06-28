const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/error");

dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
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
//file upload
app.use(fileUpload());
//set static
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/listing", require("./routes/listing"));
app.use("/", require("./routes/user"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`currently running on ${PORT}`);
});

const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

app.use(cors()); // Mengizinkan semua origin

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// define routes
app.use("/api", router);

//
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server is running on ${port}...`);
});

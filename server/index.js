const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config();

const app = express();
connectDb();

const config = require("./config/keys");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/dialogflow", require("./routes/dialogflow"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "./_front-end")));
  app.use(express.static(__dirname)); // "/" ==> "index.html"
  app.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./_front-end/index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});

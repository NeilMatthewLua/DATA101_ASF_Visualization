const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const apiRouter = require("./routes/apiRouter");

const app = express();

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

// app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req,res) {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.use('/api', apiRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
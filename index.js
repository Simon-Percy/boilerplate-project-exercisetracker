const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

//database connecting
const dbURI = process.env.DB;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(express.urlencoded({ extended: true }));

app.post("/api/users", (req, res) => {
  const username = req.body.username;
  res.json({ username });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

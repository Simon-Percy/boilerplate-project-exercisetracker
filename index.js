const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./user");
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
  const user = new User({
    username,
  });
  user
    .save()
    .then((result) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/api/users", (req, res) => {
  User.find().then((result) => {
    res.send(result);
  });
});
app.post("/api/users/:_id/exercises", (req, res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  if (!duration || !description) {
    throw Error;
  }
  let date = req.body.date;
  if (!date) {
    date = new Date();
  } else date = new Date(date);

  date = date.toDateString();
  User.findById(id)
    .then((result) => {
      result.duration = duration;
      result.description = description;
      result.date = date;
      result.log.push({
        duration: duration,
        description: description,
        date: date,
      });
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

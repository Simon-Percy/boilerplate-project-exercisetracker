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
  .then((result) =>
    app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is listening on port " + process.env.PORT);
    })
  )
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(express.urlencoded({ extended: true }));

app.post("/api/users", async (req, res) => {
  const username = req.body.username;
  const user = new User({
    username,
  });
  await user.save();
  try {
    const disUser = await User.findOne({ username }).select("username");
    res.send(disUser);
  } catch {
    console.log(err);
  }
});
app.get("/api/users", async (req, res) => {
  const disUser = await User.find().select("username");
  res.send(disUser);
});
app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  if (!duration || !description) {
    throw Error;
  }
  let d = req.body.date;
  if (!d) {
    d = new Date();
  } else {
    d = new Date(d);
  }
  const date = d.toDateString();
  const exeUser = await User.findById(id);

  exeUser.count = exeUser.count + 1;
  exeUser.duration = duration;
  exeUser.description = description;
  exeUser.date = date;
  exeUser.log.push({
    duration: +duration,
    description,
    date,
  });

  try {
    await exeUser.save();
    const disUser = await User.findById(id).select(
      "username duration description date"
    );
    res.send(disUser);
  } catch (err) {
    res.send(err);
  }
});
app.get("/api/users/:_id/logs?", async (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query;
  let logValues;
  const disUser = await User.findById(id).select("username count log");
  logValues = { ...disUser.toObject() };
  logValues.log = disUser.log.filter((item, index) => {
    if (limit == 1) {
      return new Date(item.date) > new Date("2020-08-09");
    }
  });
  res.send(logValues);
});

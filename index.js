const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./user");
require("dotenv").config();

//database connecting
const dbURI = process.env.DB;
mongoose
  .connect(dbURI)
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
    res.status(404).send("Error something happened");
  }
  let d = req.body.date;
  if (!d) {
    d = new Date();
  } else {
    d = new Date(d);
  }
  const date = d.toDateString();
  try {
    const exeUser = await User.findById(id);
    if (!exeUser) {
      res.status(404).send("No user like tha exists");
    }
    exeUser.count = exeUser.count + 1;
    exeUser.duration = duration;
    exeUser.description = description;
    exeUser.date = date;
    exeUser.log.push({
      duration: +duration,
      description,
      date,
    });

    await exeUser.save();
    const disUser = await User.findById(id).select(
      "username duration description date"
    );
    res.send(disUser);
  } catch (err) {
    console.log(err);
    res.send("Ahhh Error");
  }
});
app.get("/api/users/:_id/logs?", async (req, res) => {
  const id = req.params._id;
  let { from, to, limit } = req.query;
  try {
    const disUser = await User.findById(id).select("username count log");
    if (!disUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const logValues = { ...disUser.toObject() };
    if (from || to) {
      from ? (fromDate = new Date(from)) : (fromDate = new Date(0));

      to ? (toDate = new Date(to)) : (toDate = new Date());
      logValues.log = logValues.log
        .filter((item) => {
          const logDate = new Date(item.date);
          return logDate >= fromDate && logDate <= toDate;
        })
        .map((item) => {
          const logDate = new Date(item.date);
          return {
            description: item.description,
            duration: item.duration,
            time: logDate.toDateString(),
          };
        });
    }

    if (limit) {
      const limitedLogs = logValues.log.slice(0, limit);
      logValues.log = limitedLogs;
    }
    res.send(logValues);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log(error);
  }
});

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
  },
  date: {
    type: Date,
  },
  log: {
    type: [Object],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

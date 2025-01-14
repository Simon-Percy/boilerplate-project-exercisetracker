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
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
  log: {
    type: [Object],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

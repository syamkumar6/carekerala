const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
  review: {
    type: String,
    minlength: [4, "Review must be at least 4 characters long"],
  },
  date: String,
  likes: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    default: []
},
disLikes: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    default: []
},
});

const Reviews = mongoose.model("Reviews", ReviewSchema);

module.exports = Reviews;

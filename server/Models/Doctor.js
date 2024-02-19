const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "doctor",
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: "",
  },
  qualification: {
    type: String,
    default: "",
  },
  speciality: {
    type: String,
    default: "",
  },
  languages: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
  username: {
    type: String,
    unique: true,
    default: function () {
      return this.name.toLowerCase().replace(/\s+/g, "") + Date.now();
    },
  },
});

const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;

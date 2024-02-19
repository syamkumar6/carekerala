const mongoose = require("mongoose");


const HospitalSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type:String,
    default: "hospital"
  },
  district: {
    type: String,
    default : ""
  },
  phone: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  image: {
    type:String,
    default: ""
  },
  carousel: [
    {
      img: {
        type: String,
        default: ""
      },
    }
    
  ],
  description: {
    type: String,
    default: ""
  },
  place: String,
  facilities: [
    {
      heading: {
        type:String,
        default: ""
      },
      details: {
        type: String,
        default: ""
      },
    },
  ],
  doctors: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      }
  ],
  doctorRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    }
  ],
  isApproved: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

HospitalSchema.path('doctors').default([]);
HospitalSchema.path('doctorRequests').default([]);



const Hospital = mongoose.model("Hospital", HospitalSchema);
module.exports = Hospital;

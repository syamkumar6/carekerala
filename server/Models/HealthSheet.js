const mongoose = require("mongoose");

const HealthSheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdated: {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
    },
    date: {
      type: String,
      default: '',
    },
  },
  personalInformation: {
    fullName: { type: String, required: true },
    image: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    contactInformation: {
      address: String,
      phoneNumber: String,
      email: String,
    },
  },
  medicalHistory: {
    preExistingConditions: [String],
    allergies: [String],
    surgeries: [
      {
        name: String,
        date: String,
      },
    ],
  },
  vitalSigns: 
    {
      bloodPressure: {
        type: String,
        default: '',
      },
      heartRate: {
        type: String,
        default: '',
      },
      respiratoryRate: {
        type: String,
        default: '',
      },
      bodyTemperature: {
        type: String,
        default: '',
      },
    },
  
  medications: [
    {
      name: {
        type: String,
        default: '',
      },
      dosage: {
        type: String,
        default: '',
      },
      frequency: {
        type: String,
        default: '',
      },
    },
  ],
  diagnosticTestResults: [
    {
      type: {
        type: String,
        default: '',
      },
      result: {
        type: String,
        default: '',
      },
      date: {
        type: String,
        default: "",
      },
    },
  ],
  finalReport: {
    date: {
      type: String,
      default: ""
    },
    report: {
      type: String,
      default: ""
    }

  },
  emergencyContacts: [
    {
      name: String,
      relationship: String,
      phoneNumber: String,
    },
  ],
  healthGoalsAndLifestyle: {
    healthGoals: [String],
    dietaryHabits: String,
    exerciseRoutine: String,
  },
  updatePermission: {
    type: Boolean,
    default: false
  }
});

const HelthSheet = mongoose.model("HelthSheet", HealthSheetSchema);

module.exports = HelthSheet;
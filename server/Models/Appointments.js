const mongoose = require("mongoose");

const AppointmentsSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    hSheet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HelthSheet'
    }, 
    date: {
        type: String,
        required: true
    },
    time: String,
    phone: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
});

const Appointments = mongoose.model("Appointments", AppointmentsSchema);

module.exports = Appointments;
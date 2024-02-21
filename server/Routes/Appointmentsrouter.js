const express = require("express");
const Appointments = require("../Models/Appointments");
const router = express.Router();
const jwt = require('jsonwebtoken');


const Verify = (req, res, next) => {
    const token = req.cookies.usertoken
    if (!token) {
      return res.status(401).json({ Message: "we need token please provide it ." })
    } else {
      jwt.verify(token,process.env.JWT_SECRET,(err, decoded) => {
        if (err) {
          return res.json({ Message: "Authentication Error." })
        } else {
          req.user = decoded.user
          next();
        }
      });
    }
}

router.post('/verify', Verify, (req, res, next) => {
    return res.status(200).json({ Status: "Verify-Success", user: req.user });
})

router.get("/:userId", Verify, async (req, res) => {
    try{
       const userId = req.params.userId
       const appointments = await Appointments.find({user: userId}).populate('hospital').populate('doctor')
     
       res.status(200).json(appointments)
    }catch(err){
        console.log(err)
    }
})

router.delete("/:userId/:appointmentId",Verify, async (req, res) => {
  try {
    const userId = req.params.userId
    const appointmentId = req.params.appointmentId;

    await Appointments.findByIdAndDelete(appointmentId);
    const updatedAppointments  = await Appointments.find({user: userId}).populate('hospital').populate('doctor')
    
    res.json({ message: "Appointment Canceled successfully", appointments: updatedAppointments });
  } catch (error) {
    console.error("Error deleting appointment:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
});

router.post("/permission/:userId/:appointmentId", Verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointmentId = req.params.appointmentId;

    const appointment = await Appointments.findById(appointmentId).populate('hSheet')
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if(!appointment.hSheet){
      return res.status(404).json({ message: "Health Sheet is not avilable" })
    }
    appointment.hSheetPermission = !appointment.hSheetPermission;
    await appointment.save();

    const updatedAppointments = await Appointments.find({user: userId}).populate('hospital').populate('doctor')

    res.status(200).json({ message: "Permission updated successfully" ,appointments: updatedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/users/booking",Verify, async (req, res) =>{
  try{
      const formData = req.body;
      const newAppointment = new Appointments(formData)
      const savedAppointment = await newAppointment.save()
      res.json({ message: "success", appointment: savedAppointment })
  }catch(err){
      console.log(err)
      res.status(500).json({ status: "error", error: "Internal Server Error" })
  }
})

                    //* Doctors requests

router.get("/doctors/:userId", Verify, async (req, res) => {
  try {
      const userId = req.params.userId;
      const appointments = await Appointments.find({
        $or: [
          { user: userId },
          { doctor: userId }
        ]
          
      }).populate('hospital').populate('doctor').populate('hSheet')

      res.status(200).json(appointments);
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/doctors/approve/:userId/:appointmentId",Verify, async (req, res) => {
  try {
    const userId = req.params.userId
    const time = req.body.time
    const appointment = await Appointments.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.isApproved = true;
    appointment.time = time
    await appointment.save();
    const updatedAppointments  = await Appointments.find({
      $or: [
        { user: userId },
        { doctor: userId }
      ]  
    }).populate('hospital').populate('doctor').populate('hSheet')

    res.status(201).json({message:"Appointment Approved", appointments:updatedAppointments});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/doctors/:userId/:appointmentId",Verify, async (req, res) => {
    try {
      const userId = req.params.userId
      const appointmentId = req.params.appointmentId;

      await Appointments.findByIdAndDelete(appointmentId);
      const updatedAppointments  = await Appointments.find({
        $or: [
          { user: userId },
          { doctor: userId }
        ]  
      }).populate('hospital').populate('doctor').populate('hSheet')
      
      res.json({ message: "Appointment deleted successfully", appointments: updatedAppointments });
    } catch (error) {
      console.error("Error deleting appointment:", error)
      res.status(500).json({ message: "Internal Server Error" })
    }
});


const hospitalVerify = (req, res, next) => {
  const token = req.cookies.hospitalToken;
  if (!token) {
    return res.status(401).json({ Message: "we need token please provide it" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ Message: "Authentication Error." });
      } else {
        req.hospital = decoded.hospital
        console.log("hi")
        next();
      }
    });
  }
};

router.get("/hospitals/:hospitalId", hospitalVerify, async(req, res) => {
  try{
    const hospitalId = req.params.hospitalId
    const appointments = await Appointments.find({hospital: hospitalId})
    .populate({
      path: 'hospital',
      select: 'name _id ' 
    })
    .populate({
      path: 'doctor',
      select: 'name _id ' 
    })
    .populate({
      path: 'user',
      select: 'name _id ' 
    })
    .select('title fname lname date time phone _id isApproved')
    res.status(200).json(appointments)
  }catch(err){
    console.log(err)
  }
})

router.post("/approve/:appointmentId",hospitalVerify, async (req, res) => {
  try {
    const appointment = await Appointments.findById(req.params.appointmentId);
    const time = req.body.time
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.isApproved = true;
    appointment.time = time
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete/:hospitalId/:appointmentId",hospitalVerify, async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId
    const hospitalId = req.params.hospitalId

     await Appointments.findByIdAndDelete(appointmentId);
    const updatedAppointments  = await Appointments.find({hospital: hospitalId})
    .populate({
      path: 'hospital',
      select: 'name _id ' 
    })
    .populate({
      path: 'doctor',
      select: 'name _id ' 
    })
    .populate({
      path: 'user',
      select: 'name _id ' 
    })
    .select('title fname lname date time phone _id isApproved')

    res.json({ message: "Appointment deleted successfully", appointments: updatedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" })
  }
})


module.exports = router

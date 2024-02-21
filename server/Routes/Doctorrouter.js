const express = require("express");
const mongoose = require("mongoose");
const Doctor = require("../Models/Doctor");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const Hospital = require("../Models/Hospital");

router.post("/sign-up", async (req, res, next) => {
  try {
    const { name, email, password } = req.body.values;
    const existingUser = await Doctor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ Status: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const user = new Doctor({
      name,
      email,
      password: hash,
    });
    await user.save();

    res.status(201).json({ message: "Successfully registered" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Sign-Up failed");
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await Doctor.findOne({ email: req.body.values.email });
    if (!user) {
      return res.status(404).json({ Message: "No Records existed" });
    }
    const passwords = bcrypt.compareSync(
      req.body.values.password,
      user.password
    );
    if (!passwords) {
      return res.status(401).json({ Message: "Invalid password" });
    } else {
      const token = jwt.sign(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.cookie("usertoken", token, { sameSite: "None", secure: true });
      return res.json({
        Status: "success",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ Message: "Server side error" });
  }
});

const Verify = (req, res, next) => {
  const token = req.cookies.usertoken;
  if (!token) {
    return res
      .status(401)
      .json({ Message: "we need token please provide it ." });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ Message: "Authentication Error." });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  }
};

router.post("/verify", Verify, (req, res, next) => {
  return res.status(200).json({ Status: "Verify-Success", user: req.user });
});

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({ isVisible: true });
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/admin", async (req, res) => {
  try {
    const doctorsData = await Doctor.find({});
    const doctors = doctorsData.map((doctor) => ({
      _id: doctor._id,
      email: doctor.email,
      name: doctor.name,
      district: doctor.district,
      phone: doctor.phone,
      isVisible: doctor.isVisible
    }));
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:doctorId", async (req, res) => {
  try {
    const Id = req.params.doctorId;
    const doctor = await Doctor.findById(Id);

    res.status(201).json(doctor);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/request/:hospitalId", Verify, async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId;

    const hospital = await Hospital.findById(hospitalId);
    const token = jwt.sign(
      {
        hospital: {
          id: hospital._id,
          name: hospital.name,
          email: hospital.email,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1H" }
    );

    res.cookie("doctorRequest", token, { sameSite: "None", secure: true });
    return res.status(200).json({ message: "Token sent successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/update-doctor/:userId", Verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Doctor.findById(userId);
    const updatedData = req.body.editedDoctor;
    user.name = updatedData.name;
    user.image = updatedData.image;
    user.about = updatedData.about;
    user.address = updatedData.address;
    user.category = updatedData.category;
    user.languages = updatedData.languages;
    user.phone = updatedData.phone;
    user.qualification = updatedData.qualification;
    user.speciality = updatedData.speciality;
    user.isVisible = updatedData.isVisible || user.isVisible;
    user.district = updatedData.district;

    const updatedDoctor = await user.save();
    res.status(201).json(updatedDoctor);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/remove/:doctorId", async (req, res, next) => {
  try {
    const doctorId = req.params.doctorId;
    
    const doctor = await Doctor.findByIdAndDelete(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "doctor not found" });
    }
    const doctorsData = await Doctor.find({});
    const doctors = doctorsData.map((doctor) => ({
      _id: doctor._id,
      email: doctor.email,
      name: doctor.name,
      district: doctor.district,
      phone: doctor.phone,
      isVisible: doctor.isVisible
    }));

    return res.status(200).json({ message: "Doctor Removed", doctors });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

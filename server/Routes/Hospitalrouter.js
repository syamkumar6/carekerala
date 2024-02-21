const express = require("express");
const Hospital = require("../Models/Hospital");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {
  try {
    const hospitals = await Hospital.find({ isVisible: true });
    const serializedHospitals = hospitals.map((hospital) => ({
      _id: hospital._id,
      name: hospital.name,
      district: hospital.district,
      image: hospital.image,
      address: hospital.address,
      description: hospital.description,
      phone: hospital.phone,
    }));
    res.status(200).json(serializedHospitals);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.get("/admin", async (req, res, next) => {
  try {
    const hospitals = await Hospital.find({})
    const serializedHospitals = hospitals.map((hospital) => ({
      _id: hospital._id,
      name: hospital.name,
      email: hospital.email,
      district: hospital.district,
      phone: hospital.phone,
      isApproved: hospital.isApproved,
      isVisible: hospital.isVisible
    }));
    res.status(200).json(serializedHospitals);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.get("/:hospitalId", async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId).populate(
      "doctors"
    );
    res.status(200).json(hospital);
  } catch (err) {
    console.log(err);
    res.status(404).send("Invalid hospital id");
  }
});

router.get("/:hospitalId/doctors/:doctorId", async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId).populate(
      "doctors"
    );

    if (!hospital) {
      return res.status(404).send("Hospital not found");
    }

    const doctor = hospital.doctors.find(
      (d) => d._id.toString() === req.params.doctorId
    );

    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }

    res.status(200).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/:hospitalId/doctors", async (req, res, next) => {
  try {
    const hospitalId = req.params.hospitalId;
    const newDoctorData = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    hospital.doctors.push(newDoctorData);
    await hospital.save();
    res.status(201).json(hospital);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/approve/:hospitalId", async (req, res, next) => {
  try {
    const hospitalId = req.params.hospitalId;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    hospital.isApproved = true;
    await hospital.save();
    const hospitalsData = await Hospital.find({});
    const hospitals = hospitalsData.map((hospital) => ({
      _id: hospital._id,
      name: hospital.name,
      email: hospital.email,
      district: hospital.district,
      phone: hospital.phone,
      isApproved: hospital.isApproved,
      isVisible: hospital.isVisible
    }));

    return res.status(201).json({ message: "Permission Approved", hospitals });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.delete("/remove/:hospitalId", async (req, res, next) => {
  try {
    const hospitalId = req.params.hospitalId;

    const hospital = await Hospital.findByIdAndDelete(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    const hospitalsData = await Hospital.find({});
    const hospitals = hospitalsData.map((hospital) => ({
      _id: hospital._id,
      name: hospital.name,
      email: hospital.email,
      district: hospital.district,
      phone: hospital.phone,
      isApproved: hospital.isApproved,
      isVisible: hospital.isVisible
    }));

    return res.status(200).json({ message: "Hospital Removed", hospitals });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

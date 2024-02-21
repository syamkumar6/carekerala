const express = require("express");
const Hospital = require("../Models/Hospital");
const Doctor = require('../Models/Doctor')
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body.values;

    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ Status: "Hospital email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newHospital = new Hospital({
      name,
      email,
      password: hashedPassword,
    });
    await newHospital.save();

    return res.status(201).json({ Status: "Register Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: "Internal Server Error" });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ email: req.body.values.email });
    if (!hospital) {
      return res.status(404).json({ Message: "No Records existed" });
    }

    if (!hospital.isApproved) {
      return res
        .status(404)
        .json({
          Message: "Hospital is not approved. Contact admin for assistance.",
        });
    }

    const passwords = bcrypt.compareSync(
      req.body.values.password,
      hospital.password
    );
    if (!passwords) {
      return res.status(401).json({ Message: "Invalid password" });
    } else {
      const token = jwt.sign(
        {
          hospital: {
            id: hospital._id,
            name: hospital.name,
            email: hospital.email,
            role: hospital.role
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.cookie("hospitalToken", token, { sameSite: "None", secure: true });
      return res.json({
        Status: "success",
        hospital: {
          name: hospital.name,
          id: hospital._id,
          email: hospital.email,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ Message: "Server side error login" });
  }
});

const Verify = (req, res, next) => {
  const token = req.cookies.hospitalToken;
  if (!token) {
    return res.status(401).json({ Message: "we need token please provide it" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ Message: "Authentication Error." });
      } else {
        req.hospital = decoded.hospital;
        next();
      }
    });
  }
};

router.post("/verify", Verify, (req, res, next) => {
  return res
    .status(200)
    .json({ Status: "Verify Success", hospital: req.hospital });
});

router.get("/:hospitalId", async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId).populate('doctors').populate('doctorRequests')
    res.status(200).json(hospital);
  } catch (err) {
    console.log(err);
    res.status(404).send("Invalid hospital id");
  }
});

router.post("/update-profile/:hospitalId", Verify, async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId;
    const hospital = await Hospital.findById(hospitalId).populate('doctors').populate('doctorRequests')
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" })
    }
    const data = req.body.editedHospital;
    hospital.name = data.name
    hospital.address = data.address
    hospital.image = data.image
    hospital.district = data.district
    hospital.phone = data.phone
    hospital.isVisible = data.isVisible || hospital.isVisible
    
    await hospital.save();

    res.status(200).json({message: "Profile Updated", hospital});
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/add-image/:hospitalId", Verify, async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId;
    const hospital = await Hospital.findById(hospitalId).populate('doctors').populate('doctorRequests')
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    const image = req.body.image;
    hospital.carousel.push({ img: image });
    await hospital.save();

    res.status(200).json({message: "Image added to carousel", hospital});
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:hospitalId/:carouselId", Verify, async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId;
    const carouselId = req.params.carouselId;

    const hospital = await Hospital.findById(hospitalId).populate('doctors').populate('doctorRequests')
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const carouselIndex = hospital.carousel.findIndex(
      (item) => item._id.toString() === carouselId
    );
    if (carouselIndex === -1) {
      return res.status(404).json({ message: "Carousel item not found" });
    }

    hospital.carousel.splice(carouselIndex, 1);
    await hospital.save();

    res.status(200).json({ message: "Carousel image deleted", hospital});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/add-facility/:hospitalId", Verify, async (req, res) => {
  try {
    console.log("hi")
    const hospitalId = req.params.hospitalId;
    const hospital = await Hospital.findById(hospitalId).populate('doctors').populate('doctorRequests')
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    const newFacility = req.body
    hospital.facilities.push(newFacility);
    await hospital.save();

    res.status(200).json({message: "Added A New Facility", hospital});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/remove-facility/:hospitalId/:facilityId", Verify, async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId;
    const facilityId = req.params.facilityId;

    const hospital = await Hospital.findById(hospitalId).populate('doctors').populate('doctorRequests')
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const facilityIndex = hospital.facilities.findIndex(
      (item) => item._id.toString() === facilityId
    );
    if (facilityIndex === -1) {
      return res.status(404).json({ message: "facility item not found" });
    }

    hospital.facilities.splice(facilityIndex, 1);
    await hospital.save();

    res.status(200).json({ message: "facility deleted", hospital});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" })
  }
});

router.post("/description/:hospitalId", Verify, async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId;
    const hospital = await Hospital.findById(hospitalId).populate('doctors').populate('doctorRequests')
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    const editedDescription = req.body.editedDescription;
    hospital.description = editedDescription;
    await hospital.save();

    res
      .status(200)
      .json({ message: "Description updated successfully", hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.delete("/remove-doctor/:hospitalId/:doctorId", Verify, async (req, res) => {
  try {
    const { hospitalId, doctorId } = req.params;

    const hospital = await Hospital.findById(hospitalId).populate('doctors').populate('doctorRequests')
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const doctorRequestIndex = hospital.doctorRequests?.findIndex(request => request.equals(doctorId));

    if (doctorRequestIndex !== -1) {
      hospital.doctorRequests.splice(doctorRequestIndex, 1);
      message = "Request Rejected";
    } else {
      const doctorIndex = hospital.doctors.findIndex(docId => docId.equals(doctorId));

      if (doctorIndex !== -1) {
        hospital.doctors.splice(doctorIndex, 1);
        message = "Doctor removed successfully";
      } else {
        return res.status(404).json({ message: "Doctor not found in Hospital" });
      }

    }

    await hospital.save();
    return res.status(200).json({ message, hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/approve-doctor-request/:hospitalId/:doctorId', Verify, async (req, res) => {
  try {
    const { hospitalId, doctorId } = req.params;
    const hospital = await Hospital.findById(hospitalId).populate('doctors').populate('doctorRequests')

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const doctorRequestIndex = hospital.doctorRequests.findIndex(request => request.equals(doctorId));
    if (doctorRequestIndex === -1) {
      return res.status(404).json({ message: 'Doctor request not found' });
    }
    hospital.doctorRequests.splice(doctorRequestIndex, 1);


    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    hospital.doctors.push(doctor);

    await hospital.save(); // Save the updated hospital object

    return res.status(200).json({ message: 'Doctor request approved successfully', hospital });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


const VerifyToken = (req, res, next) => {
  const token = req.cookies.doctorRequest;
  if (!token) {
    return res.status(401).json({ Message: "we need token please provide it" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ Message: "Authentication Error." });
      } else {
        req.hospital = decoded.hospital;
        next();
      }
    });
  }
};

router.post("/handle-request/:doctorId", VerifyToken, async (req, res) => {
  try {
    const doctorId = req.params.doctorId
    const hospital = await Hospital.findById(req.hospital.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.doctorRequests.push(doctorId);
    await hospital.save();

    res.clearCookie('doctorRequest');
    return res
      .status(200)
      .json({ message: "request send successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/logout', (req, res) => {
      res.cookie('hospitalToken',"",{expiresIn:new Date(0), sameSite: 'None', secure: true })
      return res.status(200).json({ Status: "Success" });
});

module.exports = router;

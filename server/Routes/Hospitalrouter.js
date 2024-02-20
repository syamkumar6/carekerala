const express = require('express')
const Hospital = require('../Models/Hospital')
const router = express.Router()
const jwt = require('jsonwebtoken');


router.get('/', async(req, res, next) => {
  try{
    const hospitals = await Hospital.find({ isVisible: true }).populate('doctors')
    console.log('Response size:', JSON.stringify(hospitals).length);
    res.status(200).json(hospitals)
  }catch(err){
    console.log(err)
    res.status(500).send("Server Error")
  }
})

router.get('/admin', async(req, res, next) => {
  try{
    const hospitals = await Hospital.find({}).populate('doctors')
    res.status(200).json(hospitals)
  }catch(err){
    console.log(err)
    res.status(500).send("Server Error")
  }
})

router.get('/:hospitalId', async(req, res, next) => {
  try{
    const hospital = await Hospital.findById(req.params.hospitalId).populate('doctors')
    res.status(200).json(hospital)
  }catch(err){
    console.log(err)
    res.status(404).send("Invalid hospital id")
  }
})

router.get('/:hospitalId/doctors/:doctorId', async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId).populate('doctors')

    if (!hospital) {
      return res.status(404).send('Hospital not found');
    }

    const doctor = hospital.doctors.find(d => d._id.toString() === req.params.doctorId);

    if (!doctor) {
      return res.status(404).send('Doctor not found');
    }

    res.status(200).json(doctor);
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.post('/:hospitalId/doctors', async (req, res, next) => {
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

const VerifyAdmin = (req, res, next) => {
  console.log("hi")
  const token = req.cookies.admintoken
  if (!token) {
    return res.status(401).json({ Message: "we need token please provide it ." })
  } else {
    jwt.verify(token,process.env.JWT_SECRET,(err, decoded) => {
      if (err) {
        return res.json({ Message: "Authentication Error." });
      } else {
        req.admin = decoded.admin;
        next();
      }
    });
  }
}

router.post('/approve/:hospitalId',VerifyAdmin, async (req, res, next) => {
  try {
    const hospitalId = req.params.hospitalId;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    hospital.isApproved = true
    await hospital.save();
    const hospitals = await Hospital.find({})

    return res.status(201).json({message: "Permission Approved", hospitals});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.delete('/remove/:hospitalId',VerifyAdmin, async (req, res, next) => {
  try {
    const hospitalId = req.params.hospitalId;

    const hospital = await Hospital.findByIdAndDelete(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    const hospitals = await Hospital.find({})

    return res.status(200).json({message: "Hospital Removed", hospitals});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


module.exports = router

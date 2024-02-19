const express = require("express");
const HealthSheet = require("../Models/HealthSheet");
const router = express.Router();
const jwt = require('jsonwebtoken');


const Verify = (req, res, next) => {
    const token = req.cookies.usertoken
    if (!token) {
      return res.status(401).json({ Message: "we need token please provide it ." })
    } else {
      jwt.verify(token,process.env.JWT_SECRET,(err, decoded) => {
        if (err) {
          return res.json({ Message: "Authentication Error." });
        } else {
          req.user = decoded.user
          next();
        }
      });
    }
}

router.post("/create/:userId", Verify, async(req, res) => {
    try{
        const formData = req.body
        const newData = { ...formData };
        const hSheetData = new HealthSheet(newData)
        await hSheetData.save()

        res.status(200).json({message: "Health sheet created successfully"})

    }catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error");
    }
})

router.get("/:userId", Verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    let query = HealthSheet.findOne({ user: userId }).populate('lastUpdated.doctor');
    query = query.populate('lastUpdated.hospital'); 
    const hSheet = await query.exec();

    res.status(200).json(hSheet);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update/user/:userId", Verify, async (req, res) => {
  try{
    const userId = req.params.userId
    const sheet = await HealthSheet.findOne({user: userId})

    sheet.emergencyContacts = req.body.emergencyContacts;
    sheet.personalInformation = req.body.personalInformation;
    sheet.medicalHistory = req.body.medicalHistory;
    sheet.healthGoalsAndLifestyle = req.body.healthGoalsAndLifestyle; 
    await sheet.save();

    const updatedSheet = await HealthSheet.findOne({user: userId}).populate('lastUpdated.doctor').populate('lastUpdated.hospital') 
    res.status(200).json({hSheet: updatedSheet})

  }catch(err){
    console.log(err)
  }
})

router.post("/update/doctor/:userId", Verify, async (req, res) => {
  try{
    const userId = req.params.userId
    const sheet = await HealthSheet.findOne({user: userId})

    sheet.diagnosticTestResults = req.body.diagnosticTestResults;
    sheet.finalReport = req.body.finalReport;
    sheet.medications = req.body.medications;
    sheet.vitalSigns = req.body.vitalSigns;
    sheet.lastUpdated = req.body.lastUpdated;  
    await sheet.save();

    const updatedSheet = await HealthSheet.findOne({user: userId}).populate('lastUpdated.doctor').populate('lastUpdated.hospital')
    res.status(200).json({hSheet: updatedSheet})

  }catch(err){
    console.log(err)
  }
})




module.exports = router
const express = require('express')
const Users = require('../Models/Users')
const router = express.Router()
const jwt = require('jsonwebtoken');
const Reviews = require('../Models/HospitalReviews');


const Verify = (req, res, next) => {
    const token = req.cookies.usertoken
    if (!token) {
      return res.status(401).json({ Message: "we need token please provide it ." })
    } else {
      jwt.verify(token,process.env.JWT_SECRET,(err, decoded) => {
        if (err) {
          return res.json({ Message: "Authentication Error." });
        } else {
          req.user = decoded.user;
          next();
        }
      });
    }
}

router.get("/:hospitalId", async (req, res)=> {
  try{
    const hospitalId = req.params.hospitalId
    const reviews = await Reviews.find({hospital: hospitalId}).populate('user')
    return res.status(200).json(reviews);
  }catch(err){
    console.log(err)
  }
})

router.post("/users", Verify, async (req, res) => {
    try{
       const review = req.body
       const newReview = new Reviews(review)
       await newReview.save()

       const reviews = await Reviews.find({hospital: review.hospital}).populate('user')
       return res.status(201).json({ message: "Thank you for your review!", reviews });
    }catch(err){
       console.log(err)
    }
})



module.exports = router
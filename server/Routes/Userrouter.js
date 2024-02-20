const express = require('express')
const Users = require('../Models/Users')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

router.post('/sign-up', async (req, res, next) => {
    try{
        
        const {name, email, password} = req.body.values
        const existingUser = await Users.findOne({email})
        if(existingUser){
            return res.status(400).json({ Status: 'Email already exists' })
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const user = new Users({
        name,
        email,
        password: hash,
        })
        await user.save()
        
        res.status(201).json({message: "Successfully registered"})

    }catch(err){
        console.log(err)
        res.status(500).send("Sign-Up failed")
    }
})

router.post('/login', async (req, res, next) => {
    try{
        const user = await Users.findOne({email: req.body.values.email})
        if(!user) {
            return res.status(404).json({Message:"No Records existed"})
        } 
        const passwords = (bcrypt.compareSync(req.body.values.password, user.password)) 
        if(!passwords) {
           return res.status(401).json({Message:"Invalid password"})
        } else{
            const token = jwt.sign({user:{id: user._id, name:user.name, email:user.email, role:user.role}}, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.cookie('usertoken', token, { sameSite: 'None', secure: true });
            return res.json({Status:"success", user: { id: user.id, name: user.name, email: user.email, role: user.role}})
        }
        
    }catch(err){
        console.log(err)
        res.status(404).json({Message: "Server side error"})
    }
})

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

router.post('/verify', Verify, (req, res, next) => {
    return res.status(200).json({ Status: "Verify-Success", user: req.user });
})

router.post('/admin/login', async (req, res, next) => {
    try{
        const admin = await Users.findOne({email: req.body.values.email})
        if(!admin) {
            return res.status(404).json({Message:"No Records existed"})
        } 
        const passwords = (bcrypt.compareSync(req.body.values.password, admin.password)) 
        if(!passwords) {
           return res.status(401).json({Message:"Invalid password"})
        }else{
            const adminToken = jwt.sign({admin:{id: admin._id, name:admin.name, email:admin.email, role:admin.role}}, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.cookie('admintoken', adminToken, { sameSite: 'None', secure: true,});
            return res.json({Status:"success", admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role}})
        }
        
    }catch(err){
        console.log(err)
        res.status(404).json({Message: "Server side error"})
    }
})

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

router.post('/admin/verify', VerifyAdmin, (req, res, next) => {
    return res.status(200).json({ Status: "Verify-Success", admin: req.admin });
})

router.get("/"), VerifyAdmin, async (req, res) => {
    try{
        const users = await Users.find({})
        res.status(200).json(users)
    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}

router.post('/logout',Verify, (req, res) => {
    res.clearCookie('usertoken');
    res.json({ status: 'success', message: 'Logout successful' });
});


module.exports = router

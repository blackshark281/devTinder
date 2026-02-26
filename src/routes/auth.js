const express = require("express");
const User = require("../models/user");
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        // user data validation
        validateSignupData(req);
        
        const {firstName, lastName, emailId, password} = req.body;
        
        // encryping password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // creating new instance of our model
        const userData = new User({
            firstName,
            lastName,
            emailId,
            password : hashedPassword
        });

        const savedUser = await userData.save();
    // const token = await savedUser.getJWT();
    const token = await jwt.sign({_id : savedUser._id}, "secretKey", {expiresIn : "1d"});

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
    } catch (error) {
        res.status(400).send("Error saving user " + error.message);        
    }
})

router.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        // chech for email id in DB
        const isUser = await User.findOne({emailId : emailId});
        if(!isUser){
            throw new Error("Invalid credentials");
        }

        const matchPassword = await bcrypt.compare(password, isUser.password);
        
        if(!matchPassword){
            throw new Error("Invalid credentials");
        }

        const token = await jwt.sign({_id : isUser._id}, "secretKey", {expiresIn : "1d"});
        res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // REQUIRED in production
    sameSite: "none"     // REQUIRED for cross-domain
});

        res.send(isUser);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires : new Date(Date.now())
    })
    .send("logout success");
})



module.exports = router;
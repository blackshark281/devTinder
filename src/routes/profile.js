const express = require("express");
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/profile", userAuth, async (req, res) => {
    try{
        const user = req.body;
        res.send(user);

    }catch(err){
        res.status(500).send("something went wrong!");
    }
})

router.patch("/updateUser/:userId", async (req, res) => {

    const userId = req.params?.userId;
    const userData = req.body;

    try{
        const Allowed_Fields = [
            "userId", "firstName", "lastName", "password", "age", "gender", "skills", "photoUrl"
        ];

        const isUpdateAllowed = Object.keys(userData).every((k) =>
            Allowed_Fields.includes(k))

        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        
        if(userData?.skills.length > 10){
            throw new Error("skills should not be more than 10");
        }

        await User.findByIdAndUpdate({_id : userId}, userData, {runValidators: true});
        res.send("user data updated");
    }catch(error){
        res.status(400).send("unable to update user data " + error.message);
    }
})

module.exports = router;
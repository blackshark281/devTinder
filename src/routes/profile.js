const express = require("express");
const {userAuth} = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const {validateUpdateData} = require("../utils/validation");

const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);

    }catch(err){
        res.status(500).send("something went wrong!");
    }
})

router.patch("/profile/edit", userAuth, async (req, res) => {

    if(!validateUpdateData(req)){
        throw new Error("unable to update user");
    };
    
    const loggedInUserData = req.user;

    Object.keys(req.body).forEach((key) => loggedInUserData[key] = req.body[key]);

    await loggedInUserData.save();
    res.json({message : `Hello ${loggedInUserData.firstName}, your profile has been updated successfully`,
                data : loggedInUserData});
})

router.patch("/profile/password", userAuth, async (req, res) => {
    
    try{
        const user = req.user;

        const validateOldPassword = await bcrypt.compare(req.body.oldPassword, user.password);
        if(!validateOldPassword){
            throw new Error("invalid current password");
        }
        user.password = await bcrypt.hash(req.body.password, 10);

        await user.save();
        res.send("password updated successfully");
    }catch(err){
        res.status(400).send(err.message);
    }
})

// router.patch("/updateUser/:userId", async (req, res) => {

//     const userId = req.params?.userId;
//     const userData = req.body;

//     try{
//         const Allowed_Fields = [
//             "userId", "firstName", "lastName", "password", "age", "gender", "skills", "photoUrl"
//         ];

//         const isUpdateAllowed = Object.keys(userData).every((k) =>
//             Allowed_Fields.includes(k))

//         if(!isUpdateAllowed){
//             throw new Error("Update not allowed");
//         }
        
//         if(userData?.skills.length > 10){
//             throw new Error("skills should not be more than 10");
//         }

//         await User.findByIdAndUpdate({_id : userId}, userData, {runValidators: true});
//         res.send("user data updated");
//     }catch(error){
//         res.status(400).send("unable to update user data " + error.message);
//     }
// })

module.exports = router;
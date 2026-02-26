const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// get all pending connection requests for the logged in user
router.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({receiverId: loggedInUser._id, status: "interested"})
        .populate("senderId", "firstName lastName photoUrl age gender");

        if(requests.length === 0){
            return res.status(200).json({message:"no new requests"});
        }

        // const data = requests.map(row => row.senderId);

        res.json({
      message: "Data fetched successfully",
      data: requests,
    });   
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                {senderId: loggedInUser._id, status: "accepted"},
                {receiverId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("senderId receiverId", "firstName lastName photoUrl skills");
        
        const data = connections.map((row) => {
            if(row.senderId._id.toString() === loggedInUser._id.toString()){
                return row.receiverId;
            }else{
                return row.senderId;
            }
        });

        res.json({data});
    }catch(err){
        res.status(400).json({message: "Error: " + err.message});
    }
})

router.get("/feed", userAuth, async (req, res) => {
    try{
        res.set("Cache-Control", "no-store");
        const loggedInUser = req.user;

        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page-1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{senderId : loggedInUser._id}, {receiverId : loggedInUser._id}]
        }).select("senderId receiverId");

        const profilesToHide = new Set();
        
        connectionRequests.forEach((row) => {
            profilesToHide.add(row.senderId.toString());
            profilesToHide.add(row.receiverId.toString());
        });

        const feedData = await User.find({
            $and : [
            {_id : {$nin : Array.from(profilesToHide)}},
            {_id : {$ne : loggedInUser._id}}
            ]
        }).select("firstName lastName photoUrl age gender skills").skip(skip).limit(limit);

        res.json(feedData);
    }catch(err){
        res.status(400).json({"ERROR" : err.message});
    }
})

module.exports = router;
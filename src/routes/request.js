const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

router.post("/request/send/:status/:receiverId", userAuth, async (req, res) => {
    try{
        const senderId = req.user._id;
        const status = req.params?.status;
        const receiverId = req.params?.receiverId;

        if(senderId.toString() === receiverId.toString()){
            return res.status(400).send("ERROR : Sender and receiver cannot be the same");
        }

        const isReceiverExists =  await User.findById(receiverId);
        if(!isReceiverExists){
            return res.status(404).send("ERROR : Receiver does not exist");
        }

        const allowedStatus = ["interested", "ignore"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("ERROR : Invalid status " + status);
        }

        //find if there is already a request
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                {senderId, receiverId},
                {senderId: receiverId, receiverId: senderId},
            ]
        });

        if(existingRequest){
            return res.status(400).send("ERROR : Connection request already exists");
        }

        const request = new ConnectionRequest({
            senderId,
            receiverId,
            status
        });
        const data = await request.save();

        res.json({message : "Connection Request sent successfully", data: data});
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = router;
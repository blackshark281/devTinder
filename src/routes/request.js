const express = require("express");
const {userAuth} = require("../middlewares/auth");

const router = express.Router();

router.get("/sendConnection", userAuth, async (req, res) => {
    const user = req.body;

    res.send("new connection req from " + user.firstName);
})

module.exports = router;
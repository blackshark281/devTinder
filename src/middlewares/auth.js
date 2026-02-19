const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = (async (req, res, next) => {
    try{const cookie = req.cookies;
        const {token} = cookie;
        if(!token){
            throw new Error("invalid token!!!")
        }
        const resolvedToken = await jwt.verify(token, "secretKey");
        
        if(!resolvedToken){
            res.status(404).send("invalid token");
        }

        const userId = resolvedToken._id;
        const user = await User.findById({_id : userId});
        if(!user){
            res.status(400).send("user not found");
        }
    req.user = user;
    next();
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = {userAuth};
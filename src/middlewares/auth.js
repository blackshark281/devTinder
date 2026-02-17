const adminAuth = ((req, res, next) => {
    console.log("Admin auth process...");
    
    const token = "secret";
    if(token === "secret"){
        console.log("Auth completed");
        next();
    }else{
        console.log("Auth failed");
        res.status(401).send("Unauthorized user detected");
    }
})

module.exports = {adminAuth};
const express = require("express");
const {connectDB} = require("./config/database");
const app = express();
const cookie = require("cookie-parser");

app.use(express.json());
app.use(cookie());

const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const requestRoute = require("./routes/request");

app.use("/", authRoute);

app.use("/", profileRoute);

app.use("/", requestRoute);

// app.delete("/deleteUser", async (req, res) => {
//     const userEmail = req.body.emailId;
//     const query = {emailId : userEmail};

//     try{
//         await User.findOneAndDelete(query);
//         res.send("user deleted");
//     }catch(err){
//         res.status(500).send("unable to delete user")
//     }
// })

connectDB().then(()=>{
    console.log("connected to db...");
    
    app.listen(3000, (req, res) =>{
        console.log("Server started on port 3000");
    })
}).catch((err) => {
    console.err("err");
})




// app.use("/", (err, req, res, next) => {                 // wild card for error handling
//     console.log(module.err);
//     res.status(500).send("Something went wrong");
// })

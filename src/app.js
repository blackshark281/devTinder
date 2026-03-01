const express = require("express");
const {connectDB} = require("./config/database");
const app = express();
const cookie = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket =  require("./utils/socket");

require("dotenv").config();
// require("./utils/cronjob");

app.use(cors({
    // origin: "http://localhost:5173",
    origin: "https://dev-tinder-web-murex.vercel.app",
    credentials: true
}));
app.use(express.json());
app.use(cookie());

const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const requestRoute = require("./routes/request");
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");

const server = http.createServer(app);
initializeSocket(server);

app.use("/", authRoute);

app.use("/", profileRoute);

app.use("/", requestRoute);

app.use("/", userRoute);

app.use("/", chatRoute);

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
    
    server.listen(3000, (req, res) =>{
        console.log("Server started on port 3000");
    })
}).catch((err) => {
    console.log("err", err);
})




// app.use("/", (err, req, res, next) => {                 // wild card for error handling
//     console.log(module.err);
//     res.status(500).send("Something went wrong");
// })

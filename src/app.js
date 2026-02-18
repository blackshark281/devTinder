const express = require("express");
const {adminAuth} = require("./middlewares/auth");
const {connectDB} = require("./config/database");
// const { default: mongoose } = require("mongoose");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        // creating new instance of our model
        const userData = new User(req.body);

        await userData.save();

        res.send("User created successfully!")
    } catch (error) {
        res.status(500).send("Error saving user " + error.message);        
    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try{
        const user = await User.find({emailId : userEmail});
        if(user.length === 0){
            res.status(404).send("user not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(500).send("something went wrong!");
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        if(users.length === 0){
            res.status(404).send("no user found");
        }else{
            res.send(users);
        }
    } catch (error) {
        res.status(500).send("Error fetching users", error);        
    }
})

app.delete("/deleteUser", async (req, res) => {
    const userEmail = req.body.emailId;
    const query = {emailId : userEmail};

    try{
        await User.findOneAndDelete(query);
        res.send("user deleted");
    }catch(err){
        res.status(500).send("unable to delete user")
    }
})

app.patch("/updateUser/:userId", async (req, res) => {

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

connectDB().then(()=>{
    console.log("connected to db...");
    
    app.listen(3000, (req, res) =>{
        console.log("Server started on port 3000");
    })
}).catch((err) => {
    console.err("err");
})




// app.use("/admin", adminAuth);

// app.get("/admin/getData", (req, res) => {
//     try {
//         // throw new Error("err");
//         res.send("hello admin, this is your data");
//     } catch (error) {
//         res.status(500).send("error : contact support");
//     }
// })

// app.use("/", (err, req, res, next) => {                 // wild card for error handling
//     console.log(module.err);
//     res.status(500).send("Something went wrong");
// })

// app.get("/local/:userId/:name", (req, res)=>{
//     console.log(req.params);
//     res.send("Hello local GET");
// })

// app.use("/local", (req, res, next)=>{
//     // res.send("Hello local GET");
//     next();
// })

// app.use("/local/nested", (req, res)=>{
//     res.send("Hello local GET nested");
// })

// app.post("/local", (req, res)=>{
//     res.send("Hello local POST");
// })

// app.use("/user", (req, res, next)=>{
//     // res.send("Hello 1");
//     const token = "token";
//     if(token === "token1"){
//         res.send("token success");
//     }
//     else{
//         res.status(401).send("Unauthorized");
//     }
// })

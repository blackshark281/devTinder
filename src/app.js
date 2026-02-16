const express = require("express");

const app = express();

app.use("/local", (req, res)=>{
    res.send("Hello local 1");
})

app.use("/", (req, res)=>{
    res.send("Hello global");
})

app.listen(3000, (req, res) =>{
    console.log("Server started on port 3000");
})

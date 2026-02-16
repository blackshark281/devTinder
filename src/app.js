const express = require("express");

const app = express();

app.get("/local/:userId/:name", (req, res)=>{
    console.log(req.params);
    res.send("Hello local GET");
})

app.get("/local", (req, res)=>{
    console.log(req.query);
    res.send("Hello local GET");
})

app.post("/local", (req, res)=>{
    res.send("Hello local POST");
})

app.use("/", (req, res)=>{
    res.send("Hello global");
})


app.listen(3000, (req, res) =>{
    console.log("Server started on port 3000");
})

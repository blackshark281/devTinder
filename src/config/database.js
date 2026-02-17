const mongoose = require("mongoose");

const connectDB = async () =>{
   await mongoose.connect("mongodb+srv://ritikgupta9211:mongopassword@cluster0.b4ojgkn.mongodb.net/devTinder?appName=Cluster0");
}

module.exports = {connectDB};
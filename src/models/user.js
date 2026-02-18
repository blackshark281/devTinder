const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    lastName : {
        type: String
    },
    emailId : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error("not a valid email");
            }
        }
    },
    password : {
        type: String,
        required: true
    },
    age : {
        type: Number,
        min: 18
    },
    gender : {
        type: String
    },
    photoUrl: {
        type: String,
        default: "photo.img",
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new error("invalid gender");
            }
        }
    },
    skills: {
        type: [String]
    },
}, {
    timestamps: true 
});

// const userSchema.methods.getJWT = async function (){
//     const user = this;
//     const token = await jwt.sign({_id : isUser._id}, "secretKey", {expiresIn : "1d"});

//     return token;
// }

module.exports = mongoose.model("User", userSchema);

// module.exports = User;
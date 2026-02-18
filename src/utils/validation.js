const validator = require("validator");

const validateSignupData = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName || !emailId || !password){
        throw new error("invalid data");
    }
    if(!validator.isEmail(emailId)){
        throw new error("invalid email");
    }
}

module.exports = {validateSignupData};
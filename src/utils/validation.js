const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new error("invalid data");
  }
  if (!validator.isEmail(emailId)) {
    throw new error("invalid email");
  }
};

const validateUpdateData = (req) => {
  const validUpdateFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
  ];

  const isUpdateValid = Object.keys(req.body).every((field) =>
    validUpdateFields.includes(field));

  if (!isUpdateValid) {
    throw new Error("invalid fields");
  }

  if (req.photoUrl && !validator.isURL(req.photoUrl)) {
    throw new Error("invalid photo url");
  }
  if (req.skills && req.skills.length > 10) {
    throw new Error("skills can not be more than 10");
  }
  return isUpdateValid;
};

module.exports = { validateSignupData, validateUpdateData };

require("dotenv").config();
const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key);
  } catch (err) {
    console.log(err);
  }

  console.log(token);
  return token;
};

const verifyToken = (token) => {
        let key = process.env.JWT_SECRET
        let data = null
        try {
                data = jwt.verify(token, key)
        }
        catch(err) {
                console.log(err);
        }
        return data
};

module.exports = {
  createJWT,verifyToken
};

const jwt = require("jsonwebtoken");
const {JWT_PASS} = require("../key");
function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
  const auth = req.headers.authorization;
  const words = auth.split(" ");
  const token = words[2];
  try{
    const decode = jwt.verify(token, JWT_PASS);
    if (decode.username && words[1] == "user") {
      req.username = decode.username;
      next();
    } else {
      res.status(500).json({
        message: "user not authorized",
      });
    }
  }catch(err){
    res.json({message:"authorization error"}).status(403);
  }
  
}

module.exports = userMiddleware;

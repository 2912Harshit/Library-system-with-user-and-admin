// Middleware for handling auth
const jwt = require("jsonwebtoken")
const {JWT_PASS} = require("../key")
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const auth = req.headers.authorization;
    const words = auth.split(" ");
    const token = words[2];
    try {
      const decode = jwt.verify(token, JWT_PASS);
      if (decode.username && words[1] == "admin") {
        next();
      } else {
        res.status(500).json({
          message: "admin not authorized",
        });
      }
    } catch (err) {
      res.json({ message: "authorization error" }).status(403);
    }
    
}

module.exports = adminMiddleware;
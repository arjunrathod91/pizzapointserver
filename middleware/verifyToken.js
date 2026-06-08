const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // token format: "Bearer <token>"
    const actualToken = token.split(" ")[1];

    const decoded = jwt.verify(actualToken, "your_secret_key");

    req.userId = decoded.id; // IMPORTANT

    next();

  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
      error: error.message
    });
  }
};

module.exports = verifyToken;
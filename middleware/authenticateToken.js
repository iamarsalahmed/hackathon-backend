import jwt from "jsonwebtoken";
import express from "express";



const router = express.Router();


router.post("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return res.status(200).json({ success: true, message: "Token verified", user: decoded });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.AuthToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = decoded; // Attach decoded token to request object
    next();
  });
};

export default authenticateToken;

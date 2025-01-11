import jwt from "jsonwebtoken";
import User from "../models/user.js";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

export const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    // console.log(req.cookies, "yeh req cookie hai")
    // console.log('JWT token:', token ? 'Found in cookies or header' : 'Not found');
    // console.log( req.cookies.jwt, 'token jwt wala')
    if (!token) {
      // console.log('No token provided, authorization denied');
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
      // console.log('Token decoded successfully:', decoded);
    } catch (error) {
      console.log('Error decoding token:', error.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find the user associated with the decoded userId
    const user = await User.findById(decoded.userId);
    if (!user) {
      // console.log('User not found with userId:', decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }

    // console.log('User authenticated successfully:', user);
    req.user = user;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    if (error.name === "TokenExpiredError") {
      console.log('Token expired');
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ error: error.message });
  }
};

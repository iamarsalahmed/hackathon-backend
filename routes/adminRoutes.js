import express from "express";
import bcrypt from "bcryptjs";
import admin from "../models/admin.js";
import authenticateToken from "../middleware/authenticateToken.js";
import { generateToken } from "../utils/jwtHelper.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import session from "../models/session.js"
const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!phone) {
      return errorResponse(res, "Phone number is required", 400);
    }

    const existingOwner = await admin.findOne({ email });
    if (existingOwner) {
      return errorResponse(res, "Owner already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = new admin({ name, email, password: hashedPassword, phone });
    await newOwner.save();

    successResponse(res, "Restaurant Owner created successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await admin.findOne({ email }).select("+password");
    if (!owner) {
      return errorResponse(res, "Owner not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const token = generateToken({ email: owner.email, userId: owner._id });

    res.cookie("AuthToken", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    const newSession = new session({
      adminId: owner._id,
      token: token,
    });

    // console.log("Saving new user to database:", newUser);
    await newSession.save()
    successResponse(res, "Login successful");
  } catch (error) {
    errorResponse(res, error.message);
  }
});

// Get All Owners Route
router.get("/owners", async (req, res) => {
  try {
    const owners = await admin.find({}, { name: 1, email: 1, phone: 1 });
    successResponse(res, "Owners fetched successfully", { owners });
  } catch (error) {
    errorResponse(res, error.message);
  }
});

// Get Owner Details Route
router.get("/ownerDetails", authenticateToken, async (req, res) => {
  try {
    const adminId = req.user.userId;

    const owner = await admin.findById(adminId, {
      name: 1,
      email: 1,
      phone: 1,
      profileImage: 1,
      createdAt: 1,
    });

    if (!owner) {
      return errorResponse(res, "Restaurant owner not found", 404);
    }

    successResponse(res, "Owner details fetched successfully", { owner });
  } catch (error) {
    errorResponse(res, error.message);
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("AuthToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  successResponse(res, "Logged out successfully");
});

export default router;

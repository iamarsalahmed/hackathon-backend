
import express from "express";
import bcrypt from 'bcryptjs';
import fileUpload from "express-fileupload";
import cloudinary from "../config/couldinary.js";
import User from "../models/user.js"; // Import your User model
import signup from "../controller/authController.js"
import jwt from 'jsonwebtoken'
import {jwtDecode} from "jwt-decode";
const router = express.Router();

// Enable file upload middleware for this router
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

router.post('/signup', signup);

// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password, phone, address } = req.body;

//     if (!phone) {
//       return res.status(400).json({ message: "Phone number is required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Handle file upload for profile image
//     let profileImageUrl = "";
//     console.log(profileImageUrl, "profileImageUrl")
//     if (req.files && req.files.profileImage) {
//       const file = req.files.profileImage;

//       try {
//         const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
//           folder: "profile_images",
//           public_id: `${email}_profile`,
//         });
//         profileImageUrl = uploadResult.secure_url;
//       } catch (error) {
//         return res.status(500).json({ message: "Error uploading profile image", error: error.message });
//       }
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       profileImage: profileImageUrl, // Save the Cloudinary URL
//       address: address, // Ensure the address is parsed from the frontend
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User created successfully", user: newUser });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// router.post("/signup", async (req, res) => {
//     try {
//       const { name, email, password, role = "user", address, phone } = req.body;
  
//       if (!phone) {
//         return res.status(400).json({ message: "Phone number is required" });
//       }
  
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }
  
//       // Hash password and create user
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({
//         name,
//         email,
//         password: hashedPassword,
//         role,
//         address,
//         phone,
//       });
//       await newUser.save();
  
//       res.status(201).json({ message: "User created successfully" });
//     } catch (error) {
  
//       res.status(500).json({ error: error.message});
//     }
//   });
  
// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const client = await User.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
console.log ( "password checked okay")
    // Generate JWT
    const token = jwt.sign(
      { email: client.email, userId: client._id, role: client.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log ( "token checked okay")
    res.cookie("jwt", token,  {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only true in production
      sameSite: 'None' // Allow cross-origin requests
     
    }); // Set `secure: true` in production
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Users Route
router.get("/userDetails", async (req, res) => {
  try {
    // Extract userId from the Authorization token
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from Authorization header

    console.log(token, "req.cookie token")
    if (!token) {
      return res.status(400).json({ error: "Token not provided" });
    }

    // Decode the token to extract userId
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId; // Assuming the token contains userId
    console.log("Decoded userId:", userId); // Debugging log

    // Fetch user details from the database using userId
    const user = await User.findById(userId, { name: 1, email: 1, role: 1, phone: 1, profileImage :1, createdAt: 1, _id: 1       }); // Replace 'otherField' with fields you need
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user); // Return the user details
  } catch (error) {
    console.error("Error fetching user details:", error); // Error handling log
    res.status(500).json({ error: error.message });
  }
});


// Logout Route
router.post("/user/logout", (req, res) => {
  res.clearCookie("jwt", { httpOnly: true});
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;

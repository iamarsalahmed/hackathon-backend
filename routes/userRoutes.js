import bcrypt from "bcryptjs";
import fileUpload from "express-fileupload";
import cloudinary from "../config/couldinary.js";
import User from "../models/user.js"; // Import your User model
import signup from "../controller/authController.js";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "../middleware/auth.js";
import express from "express";
const router = express.Router();

// Enable file upload middleware for this router
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.post("/signup", signup);
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const client = await User.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // Generate the JWT token
    const token = jwt.sign(
      { email: client.email, userId: client._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Set the token as a cookie
    res.cookie("AuthToken", token, {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: true, // Use secure cookies in production
      sameSite: "None", // Cross-site cookie (important for production)
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Send the token in the response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
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
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const client = await User.findOne({ email });
//     if (!client) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, client.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid Password" });
//     }
  

//     const token = jwt.sign(
//       { email: client.email, userId: client._id },
//       process.env.SECRET_KEY,
//       { expiresIn: "1h" }
//     );
   

//     //  res.cookie("AuthToken", token,  {
//     //    secure: true, 
//     //    sameSite: 'None' 

//     //  }); 

  
//     res.status(200).json({ message: 'Login successful' });
//     // console.log("cookie checked okay", token);
    
//     // res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get All Users Route
router.get("/userDetails", isAuthenticated, async (req, res) => {
  try {
    // Extract userId from the Authorization token
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from Authorization header


    if (!token) {
      return res.status(400).json({ error: "Token not provided" });
    }

    // Decode the token to extract userId
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId; // Assuming the token contains userId
    // console.log("Decoded userId:", userId); // Debugging log

    // Fetch user details from the database using userId
    const user = await User.findById(userId, {
      name: 1,
      email: 1,
      role: 1,
      phone: 1,
      profileImage: 1,
      createdAt: 1,
      _id: 1,
    }); // Replace 'otherField' with fields you need
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
  res.clearCookie("AuthToken", { httpOnly: true });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;

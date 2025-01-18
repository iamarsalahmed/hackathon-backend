

// export default router;
import express from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import RestaurantOwner from '../models/RestaurantOwner.js'
import { jwtDecode } from "jwt-decode"
import cookieParser from "cookie-parser";


const router = express.Router();

router.post("/owner/signup", async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
  
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }
  
      const existingOwner = await RestaurantOwner.findOne({ email });
      if (existingOwner) {
        return res.status(400).json({ message: "Owner already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newOwner = new RestaurantOwner({
        name,
        email,
        password: hashedPassword,
        phone,
      });
  
      await newOwner.save();
      res.status(201).json({ message: "Restaurant Owner created successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Login Route
// router.post("/owner/login", async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       const owner = await RestaurantOwner.findOne({ email }).select("+password");
//       if (!owner) {
//         return res.status(404).json({ message: "Owner not found" });
//       }
  
//       const isPasswordValid = await bcrypt.compare(password, owner.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }
  
//       // const token = jwt.sign(
//       //   { email: owner.email, userId: owner._id },
//       //   process.env.SECRET_KEY,
//       //   { expiresIn: "1h" }
//       // );
  
//       // res.cookie("jwt", token, {
//       //   httpOnly: true,
//       //   secure: process.env.NODE_ENV === 'production', // Only true in production
//       //   sameSite: 'None' // Allow cross-origin requests
       
//       // });
//       const token = jwt.sign(
//         { email: owner.email, userId: owner._id },
//         process.env.SECRET_KEY,
//         { expiresIn: "1h" }
//       );
      
//       // Set the cookie with the specified attributes
//       res.setHeader(
//         "Set-Cookie",
//         `jwt=${token}; HttpOnly; SameSite=None; Secure; Path=/; Partitioned`
//       );
      
//       // Send response
//       res.status(200).json({ message: "Token set in cookie successfully" });
      
//       res.status(200).json({ message: "Login successful" });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
router.post("/owner/login",  async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the owner by email and include the password in the query
    const owner = await RestaurantOwner.findOne({ email }).select("+password");
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate the JWT token
    const token = jwt.sign(
      { email: owner.email, userId: owner._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
console.log(token, "from backend")
    // Set the cookie with the specified attributes
    // res.setHeader(
    //   "Set-Cookie",
    //   `jwt=${token}; HttpOnly; SameSite=None; Secure; Path=/; Partitioned`
    // );
    // res.cookie("jwt", token,{
    //   maxAge: 3600000, // Set cookie expiry (1 hour in this case)
    //   sameSite= "none"
    // } );
    res.cookie("jwt", token, {
      maxAge: 3600000, // 1 hour in milliseconds
      httpOnly: false, // Prevent access from JavaScript
      secure: true, // Set secure only in production
      sameSite: "None", // Allow cross-site requests
    });
    
    // Send response
    return res.status(200).json({ message: "Login successful, token set in cookie" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// router.post("/owner/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user
//     const client = await RestaurantOwner.findOne({ email });
//     if (!client) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Compare passwords
//     const isPasswordValid = await bcrypt.compare(password, client.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
// console.log ( "password checked okay")
//     // Generate JWT
//     const token = jwt.sign(
//       { email: client.email, userId: client._id, role: client.role },
//       process.env.SECRET_KEY,
//       { expiresIn: "1h" }
//     );
//     console.log ( "token checked okay")
//     res.cookie("jwt", token, { httpOnly: false }); // Set `secure: true` in production
//     res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });  

// Get All Users Route
router.get("/owners", async (req, res) => {
    try {
      const owners = await RestaurantOwner.find({}, { name: 1, email: 1, phone: 1 });
      res.status(200).json(owners);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get("/ownerDetails", async (req, res) => {
    try {
      // Extract token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwtToken;
   
      // console.log("Token from Authorization header:", req.headers.authorization?.split(" ")[1]);
      // console.log("Token from cookies:", req.cookies.jwtToken);
      // Get the token from Authorization header
  
      if (!token) {
        return res.status(400).json({ error: "Token not provided" });
      }
  
      // Decode the token to extract restaurantOwnerId
      const decodedToken = jwtDecode(token);
      console.log(decodedToken, "decodedToken")
      const restaurantOwnerId = decodedToken.userId; // Assuming the token contains the restaurantOwnerId
     
  
      // Fetch the restaurant owner details from the database
      const owner = await RestaurantOwner.findById(restaurantOwnerId, {
        name: 1,
        email: 1,
        phone: 1,
        profileImage: 1,
        createdAt: 1,
        _id: 1, // Add any other fields you need
      });
   
      if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
      }
  
      // Return the restaurant owner details
      res.status(200).json(owner);
    } catch (error) {
      console.error("Error fetching restaurant owner details:", error); // Error handling log
      res.status(500).json({ error: error.message });
    }
  });
  
// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", { httpOnly: true});
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;

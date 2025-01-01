import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import cloudinary from "../config/couldinary.js"; // Cloudinary configuration

const signup = async (req, res) => {
  try {
    const { name, email, password, phone, address, profileImage } = req.body;
    console.log("Received signup request with data:", { name, email, password, phone, address });
 

    // Hash the password
    console.log("Hashing password for user:", email);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      profileImage: profileImage,
      address,
    });

    console.log("Saving new user to database:", newUser);
    await newUser.save();
    console.log("User created successfully.");

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error("Error during signup process:", error);
    res.status(500).json({ error: error.message });
  }
};

export default signup;

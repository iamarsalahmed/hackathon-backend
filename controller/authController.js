import bcrypt from 'bcrypt';
import User from '../models/user.js';
import cloudinary from "../config/couldinary.js"; // Cloudinary configuration

const signup = async (req, res) => {
  try {
    const { name, email, password, phone, address, profileImage } = req.body;
    console.log("Received signup request with data:", { name, email, password, phone, address });
    // let profileImageUrl = '';

    // // Handle profile image upload if exists
    // if (req.files && req.files.profileImage) {
    //   const file = req.files.profileImage;
    //   console.log("Received file for profile image:", file);

    //   try {
    //     const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
    //       folder: 'profile_images',
    //       public_id: `${email}_profile`,
    //     });
    //     console.log("Cloudinary upload result:", uploadResult);
    //     profileImageUrl = uploadResult.secure_url;
    //   } catch (cloudinaryError) {
    //     console.error("Error uploading to Cloudinary:", cloudinaryError);
    //     return res.status(500).json({ message: "Error uploading profile image", error: cloudinaryError.message });
    //   }
    // } else {
    //   console.log("No profile image provided.");
    // }

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

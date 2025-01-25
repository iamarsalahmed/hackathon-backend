import mongoose from "mongoose";

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String},
    profileImage: { type: String }, // Field for profile photo URL
    address: { 
      street: String, 
      city: String, 
      state: String, 
      postalCode: String 
    },
}, { timestamps: true }));

export default User;

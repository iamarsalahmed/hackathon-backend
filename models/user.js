import mongoose from "mongoose";

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profileImage: { type: String }, // Field for profile photo URL
    address: { 
      street: String, 
      city: String, 
      state: String, 
      postalCode: String 
    },
    orderHistory: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        date: { type: Date },
      },
    ],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
}, { timestamps: true }));

export default User;


import mongoose from 'mongoose';
import Order from './Order.js';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
    },
    cuisine: { type: String },
    menu: [
      {
        itemName: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        imageUrl: { type: String },
      },
    ],
    profileImage: { type: String }, // Added field for restaurant image URL
    rating: { type: Number, default: 0 },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;

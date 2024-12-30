import mongoose from 'mongoose';

const restaurantOwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    restaurants: [
      {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      },
    ],
  },
  { timestamps: true }
);

const RestaurantOwner =  mongoose.model('RestaurantOwner', restaurantOwnerSchema);
export default RestaurantOwner;
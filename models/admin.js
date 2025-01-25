import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
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

const admin =  mongoose.model('admin', adminSchema);
export default admin;
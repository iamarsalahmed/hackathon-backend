import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [
      {
        itemName: { type: String },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
    },
    placedAt: { type: Date, default: Date.now },
  }, { timestamps: true });
  
  const Order = mongoose.model('Order', orderSchema);
  export default Order;
  
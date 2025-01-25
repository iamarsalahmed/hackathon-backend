import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: false},
    token: {type:String, required: true}
   
  },
  { timestamps: true }
);

const session =  mongoose.model('session', SessionSchema);
export default session;
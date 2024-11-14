import mongoose from 'mongoose';



const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References the User model
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const CarModel = mongoose.model('Car', carSchema);
export default CarModel;

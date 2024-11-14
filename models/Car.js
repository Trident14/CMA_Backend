import mongoose from 'mongoose';

// Helper function to validate the number of images
const arrayLimit = (val) => val.length <= 10;

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References the User model
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true, validate: [arrayLimit, 'You can only upload up to 10 images'] }],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const CarModel = mongoose.model('Car', carSchema);
export default CarModel;

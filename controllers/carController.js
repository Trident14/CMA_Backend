import Router from 'express';
import Car from '../models/Car.js' ;
const router = Router();  // Always use express.Router()

// Create a new car
router.post('/create', async (req, res) => {
  try {
    const { title, description, images, tags } = req.body;
    // Ensure the car doesn't have more than 10 images
    if (!images || images.length > 10) {
      return res.status(400).json({ message: 'You can only upload up to 10 images.' });
    }

    // Use req.user to associate the car with the authenticated user
    const car = new Car({
      owner: req.user._id,  // Attach the user's ID to the car from req.user
      title,
      description,
      images,
      tags,
    });

    await car.save();
    res.status(201).json(car);  // Return the newly created car
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all cars for the authenticated user
router.get('/', async (req, res) => {
  try {
    // Use req.user._id to get cars only for the authenticated user
    const cars = await Car.find({ owner: req.user._id });
    res.status(200).json(cars);  // Return list of cars for the authenticated user
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get a specific car by ID
router.get('/:carId', async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);

    // Ensure the car belongs to the logged-in user
    if (!car || car.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Car not found or unauthorized' });
    }

    res.status(200).json(car);  // Return the specific car
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a car
router.put('/:carId', async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);

    // Ensure the car belongs to the logged-in user
    if (!car || car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this car' });
    }

    const { title, description, images, tags } = req.body;

    // Ensure the user doesn't upload more than 10 images
    if (images && images.length > 10) {
      return res.status(400).json({ message: 'You can only upload up to 10 images.' });
    }

    car.title = title || car.title;
    car.description = description || car.description;
    car.images = images || car.images;
    car.tags = tags || car.tags;

    await car.save();
    res.status(200).json(car);  // Return the updated car
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a car
router.delete('/:carId', async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);

    // Ensure the car belongs to the logged-in user
    if (!car || car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this car' });
    }

    await car.remove();
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router // Export the router to use in other files

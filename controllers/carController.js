import Router from 'express';
import Car from '../models/Car.js';
import { protect } from '../utility/auth.js';

const router = Router();  // Always use express.Router()

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: API for managing car listings
 */

/**
 * @swagger
 * /api/cars/create:
 *   post:
 *     tags: [Cars]
 *     summary: Create a new car
 *     description: Create a new car listing with a title, description, images, and tags. Requires JWT authentication.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the car
 *                 example: 'Toyota Corolla 2020'
 *               description:
 *                 type: string
 *                 description: The description of the car
 *                 example: 'A reliable car with great fuel efficiency.'
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Toyota', 'Sedan', '2020']
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs of images of the car
 *                 example: ['http://image1.com', 'http://image2.com']
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Bad request if there are issues with the car data
 *       500:
 *         description: Server error
 */
router.post('/create',async (req, res) => {
  try {
    const { title, description, images, tags } = req.body;
    if (images.length > 10) {
      return res.status(400).json({ message: 'You can only upload up to 10 images.' });
    }

    const car = new Car({
      owner: req.user._id,
      title,
      description,
      images,
      tags,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @swagger
 * /api/cars:
 *   get:
 *     tags: [Cars]
 *     summary: Get all cars for the authenticated user
 *     description: Retrieve a list of all cars created by the authenticated user. Requires JWT authentication.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       401:
 *         description: Unauthorized if no token is provided or if the token is invalid
 *       500:
 *         description: Server error
 */
router.get('/',async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @swagger
 * /api/cars/{carId}:
 *   get:
 *     tags: [Cars]
 *     summary: Get a specific car by ID
 *     description: Retrieve a specific car by its ID. The car must belong to the authenticated user. Requires JWT authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         description: The ID of the car
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested car
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       403:
 *         description: Forbidden if the car does not belong to the authenticated user
 *       500:
 *         description: Server error
 */
router.get('/:carId',async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);

    if (!car || car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this car' });
    }

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @swagger
 * /api/cars/{carId}:
 *   put:
 *     tags: [Cars]
 *     summary: Update a car's details
 *     description: Update the title, description, images, or tags of an existing car. Requires JWT authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         description: The ID of the car
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the car
 *               description:
 *                 type: string
 *                 description: The updated description of the car
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated URLs of images
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated tags
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       400:
 *         description: Bad request if there are issues with the car data
 *       403:
 *         description: Forbidden if the car does not belong to the authenticated user
 *       500:
 *         description: Server error
 */
router.put('/:carId',async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);

    if (!car || car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this car' });
    }

    const { title, description, images, tags } = req.body;

    if (images && images.length > 10) {
      return res.status(400).json({ message: 'You can only upload up to 10 images.' });
    }

    car.title = title || car.title;
    car.description = description || car.description;
    car.images = images || car.images;
    car.tags = tags || car.tags;

    await car.save();
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @swagger
 * /api/cars/{carId}:
 *   delete:
 *     tags: [Cars]
 *     summary: Delete a car
 *     description: Delete a car listing. The car must belong to the authenticated user. Requires JWT authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         description: The ID of the car
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       403:
 *         description: Forbidden if the car does not belong to the authenticated user
 *       500:
 *         description: Server error
 */

router.delete('/:carId', async (req, res) => {
  try {
    // Find the car by ID
    const car = await Car.findById(req.params.carId);

    // Check if the car exists
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if the logged-in user is the owner of the car
    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this car' });
    }

    // Delete the car
    await Car.findByIdAndDelete(req.params.carId);

    // Return a success response
    res.status(200).json({ message: 'Car deleted successfully', carId: req.params.carId });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: 'Server error', error });
  }
});


export default router;

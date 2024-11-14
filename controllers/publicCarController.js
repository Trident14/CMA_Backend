// controllers/publicCarController.js
import express from 'express';
import Car from '../models/Car.js';

const router = express.Router();

/**
 * @swagger
 * /api/cars/all:
 *   get:
 *     summary: Fetch all cars
 *     description: Get a list of all cars in the system (public route).
 *     responses:
 *       200:
 *         description: List of all cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Car ID
 *                   owner:
 *                     type: string
 *                     description: Owner's User ID
 *                   title:
 *                     type: string
 *                     description: Car title
 *                   description:
 *                     type: string
 *                     description: Car description
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of image URLs for the car
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Tags associated with the car (e.g., car type, company)
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Car creation date
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: error message
 */
router.get('/all', async (req, res) => {
  try {
    // Fetch all cars from the database
    const cars = await Car.find();

    // Return the list of cars
    res.status(200).json(cars);
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;

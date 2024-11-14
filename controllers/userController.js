import UserModel from '../models/User.js'; 
import { comparePassword, createJWT, hashPassword } from '../utility/auth.js';

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [User]
 *     summary: Register a new user
 *     description: Registers a new user with a username and password. No authentication required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user
 *                 example: 'john_doe'
 *               password:
 *                 type: string
 *                 description: The password for the new user
 *                 example: 'securePassword123'
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Username already exists
 *       500:
 *         description: Server error
 */
export const createNewUser = async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({ username: req.body.username });

        if (existingUser) { 
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hash = await hashPassword(req.body.password);

        const user = new UserModel({
            username: req.body.username,
            password: hash
        });

        await user.save();
        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [User]
 *     summary: Login a user
 *     description: Authenticates a user by username and password and returns a JWT token for future requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: 'john_doe'
 *               password:
 *                 type: string
 *                 description: The password for the user
 *                 example: 'securePassword123'
 *     responses:
 *       200:
 *         description: Successfully logged in. JWT token is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for authentication
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5fZG9lIiwiaWF0IjoxNjM4NzEyMzIyfQ.S3P5oW5nHXsSFWl6E6Di5D7Im3lBOIFkJHUtH5MbKXY'
 *                 username:
 *                   type: string
 *                   description: The username of the authenticated user
 *                   example: 'john_doe'
 *                 isAdmin:
 *                   type: boolean
 *                   description: Whether the user is an admin
 *                   example: false
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */
export const signin = async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isValid = await comparePassword(req.body.password, user.password);

        if (!isValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        const token = createJWT(user);
        
        res.status(200).json({ token, username: user.username, isAdmin: user.isAdmin });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

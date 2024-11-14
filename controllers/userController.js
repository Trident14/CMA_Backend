import UserModel from '../models/User.js'; 
import { comparePassword, createJWT, hashPassword } from '../utility/auth.js';

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

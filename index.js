import express from 'express';
import mongoose from 'mongoose';
import { createNewUser, signin } from './controllers/userController.js';
import router from './controllers/carController.js';
import {protect}  from './utility/auth.js'; 
import dotenv from 'dotenv'
dotenv.config();

const app = express();
app.use(express.json());
const PORT = 5050 || process.env.port;
mongoose.connect(process.env.DBkey);

app.get("/", protect, (req, res) => {
    res.status(200).json({ message: "Request was successful!" });
  });

  app.get("/Test",  (req, res) => {
    res.status(200).json({ message: "Request was successful!" });
  });
app.post('/register', createNewUser); // User registration
app.post('/login', signin); // User login
app.use('/api/cars',protect, router);
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
  
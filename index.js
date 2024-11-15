import express from 'express';
import mongoose from 'mongoose';
import { createNewUser, signin } from './controllers/userController.js';
import router from './controllers/carController.js';
import { protect } from './utility/auth.js';
import dotenv from 'dotenv';
import publicCarRouter from './controllers/publicCarController.js'
import swaggerJSDoc from 'swagger-jsdoc';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';


dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json());
const PORT = 5050 || process.env.port;
mongoose.connect(process.env.DBkey);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Management API',
      version: '1.0.0',
      description: 'API documentation for the Car Management Application',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'JWT token for authorization',
        }
      }
    },
    tags: [
      {
        name: 'Cars',
        description: 'API for managing car listings',
      },
      {
        name: 'User',
        description: 'API for managing user registration and authentication',
      }
    ],
    security: [
      {
        BearerAuth: [],
      }
    ]
  },
  apis: ['./controllers/*.js', './models/*.js', './utility/*.js'], // Path to your API files
};


const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI at /api/docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Example route to test the Swagger documentation
app.get("/", protect, (req, res) => {
  res.status(200).json({ message: "Request was successful!" });
});



// Other routes...
app.post('/register', createNewUser); // User registration
app.post('/login', signin); // User login
app.use('/api/cars', publicCarRouter);
app.use('/api/cars', protect, router);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

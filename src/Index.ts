import express from 'express';
import { json, urlencoded } from 'body-parser';
import { connectDatabase } from './dataBase';
import login from './routes/controller/login.controller';
import signup from "./routes/controller/signup.controller"

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/auth', login);
app.use('/auth',signup );

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();

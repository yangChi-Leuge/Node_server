import express, { Request, Response } from 'express';
import { getConnection } from '../../dataBase';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Validate username and password (example)
  if (username === 'user' && password === 'password') {
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;

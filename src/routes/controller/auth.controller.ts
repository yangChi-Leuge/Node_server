import express, { Request, Response } from 'express';
import { authenticateUser } from '../service/auth.service';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { id, password } = req.headers;

  // 입력값 검증
  if (!id || !password) {
    return res.status(400).json({ message: 'ID and password are required' });
  }

  try {
    const user = await authenticateUser(id as string, password as string);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const data = {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken
    };

    return res.status(200).json({ message: 'Login successful', data });
  } catch (error : any ) {
    console.error('Error during login:', error);

    // MySQL 관련 에러 처리
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ message: 'Database access denied' });
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      return res.status(500).json({ message: 'Database not found' });
    }

    // JWT 관련 에러 처리
    if (error.name === 'JsonWebTokenError') {
      return res.status(500).json({ message: 'Error generating token' });
    }

    // 기타 에러 처리
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

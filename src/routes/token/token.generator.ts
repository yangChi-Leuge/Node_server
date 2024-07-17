import jwt from 'jsonwebtoken';
import { env } from '../../env';
// accessToken 생성 함수
export const generateAccessToken = (payload: any): string => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' });
  };
  
  // refreshToken 생성 함수
  export const generateRefreshToken = (payload: any): string => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
  };
  
import jwt from 'jsonwebtoken';
import { env } from '../../env';

export const getUserIdFromAccessToken = (accessToken: string): string | null => {
    try {
        const decoded = jwt.verify(accessToken, env.JWT_SECRET) as { id: string };
        return decoded.id; 
    } catch (error) {
        console.error('Error decoding access token:', error);
        return null; 
    }
}
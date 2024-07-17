import jwt from 'jsonwebtoken';
import { env } from '../../env';

export const getUserIdFromAccessToken = (accessToken: string): string | null => {
    try {
        const decoded = jwt.verify(accessToken, env.JWT_SECRET) as { id: string };
        return decoded.id; 
    } catch (error) {
        console.error('엑세스 토큰 불러오는중 에러:', error);
        return null; 
    }
}
export const getUserNameFromAccessToken = (accessToken:string):string | null=>{
    try {
        const decoded = jwt.verify(accessToken, env.JWT_SECRET) as { name: string };
        return decoded.name; 
    } catch (error) {
        console.error('엑세스 토큰 불러오는중 에러:', error);
        return null; 
    }
}
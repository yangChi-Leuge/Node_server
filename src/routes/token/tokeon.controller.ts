import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

interface jwtUser {
    id:string
    name:string
    passwrod:string
}

router.post("/refresh", async (req: Request, res: Response) => {
    const refreshToken = req.headers['authorization'];

    if (!refreshToken) {
        return res.status(401).json({ message: "refreshToken 없음" });
    }

    try {
        
        const secretKey = process.env.REFRESH_TOKEN_SECRET;

        
        const payload = jwt.verify(refreshToken, secretKey);

        
        const newAccessToken = jwt.sign(
            { userId: payload.id }, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" } 
        );

        return res.json({ accessToken: newAccessToken });
    } catch (error: any) {
        console.error(error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "유효하지 않은 토큰" });
        }

        return res.status(500).json({ message: "토큰 갱신 중 오류 발생" });
    }
});

export default router;
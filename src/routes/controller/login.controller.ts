/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Member Verification
 *     description: ID, and Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: 로그인 성공
 *       '401':
 *         description: 잘못된 자격 증명
 *       '500':
 *         description: 내부 서버 오류
 */

import express, { Request, Response } from "express";
import { authenticateUser } from "../service/login.service";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { id, password } = req.headers;

  if (!id || !password) {
    return res.status(400).json({ message: "ID and password are required" });
  }

  try {
    const user = await authenticateUser(id as string, password as string);

    if (!user) {
      return res.status(401).json({ message: "userNotFound" });
    }

    const data = {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };

    return res.status(200).json({ message: "success", data });
  } catch (error: any) {
    console.error("Error during login:", error);

    // MySQL 관련 에러 처리
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      return res.status(500).json({ message: "Database access denied" });
    } else if (error.code === "ER_BAD_DB_ERROR") {
      return res.status(500).json({ message: "Database not found" });
    }

    // JWT 관련 에러 처리
    if (error.name === "JsonWebTokenError") {
      return res.status(500).json({ message: "Error generating token" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

import express, { Request, Response } from "express";
import { createUser } from "../service/signup.service";

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user with ID, name, and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: 회원가입 성공
 *       '401':
 *         description: 잘못된 자격 증명
 *       '500':
 *         description: 내부 서버 오류
 */

router.post("/signup", async (req: Request, res: Response) => {
  const { id, name, password } = req.headers as { [key: string]: string };
  try {
    const newUser = { id, name, password };

    const success = await createUser(newUser);

    if (!success) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "회원가입 성공!" });
  } catch (error: any) {
    console.error("회원가입 중 오류 발생:", error);

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      return res.status(500).json({ message: "데이터베이스 접근 권한 거부" });
    } else if (error.code === "ER_BAD_DB_ERROR") {
      return res.status(500).json({ message: "데이터베이스를 찾을 수 없음" });
    }

    return res.status(500).json({ message: "내부 서버 오류" });
  }
});

export default router;

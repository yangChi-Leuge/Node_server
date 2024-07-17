import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../../dataBase";
import { env } from "../../env";

const router = express.Router();
const db = getConnection();

router.get("/", async (req: Request, res: Response) => {
  const { day } = req.query as { day: string };
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "토큰이 필요합니다" });
  } else if (!day) {
    return res.status(400).json({ message: "day에 값이 없습니다" });
  }
  try {
    const query = `SELECT * FROM tbl_global_day`;
    const [role] = await db.execute(query);

    return res.status(200).json({ message: "챌린지 불러오기 성공", role });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "챌린지 불러오는중 오류" });
  }
});


export default router;
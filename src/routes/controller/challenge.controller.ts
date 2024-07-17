import express, { Request, Response } from "express";
import { getConnection } from "../../dataBase";
import { getUserIdFromAccessToken } from "../token/jwt";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { date } = req.query as { date: string };
  const db = getConnection();

  try {


    const month = date.substring(0, 2);
    let query = `
    SELECT p.*, p.hashtage AS hashtag
    FROM tbl_post p
    WHERE p.hashtage IS NOT NULL
  `;

  if (month) {
    query += ` AND p.date LIKE '${month}%'`; 
  }

    const [data] = await db.execute(query);

    return res.status(200).json({ message: "챌린지 게시물 조회 성공", data });
  } catch (error) {
    console.error("챌린지 게시물을 불러오는 중 에러 발생:", error);
    return res.status(500).json({ message: "챌린지 게시물 조회 중 오류 발생" });
  }
});

export default router;

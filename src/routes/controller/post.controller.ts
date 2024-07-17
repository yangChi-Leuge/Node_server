import express, { Request, Response } from "express";
import { getConnection } from "../../dataBase";
import { getUserIdFromAccessToken } from "../token/jwt";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { title, content, hashtag, day } = req.body;
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "토큰이 필요합니다." });
  } else if (!title || !content) {
    return res.status(400).json({ message: "제목이나 내용이 없습니다." });
  }

  try {
    const userId = getUserIdFromAccessToken(accessToken);
    const db = getConnection();

    let query, values;

    // 해시태그가 있는 경우 챌린지 생성
    if (hashtag) {
      query = `INSERT INTO tbl_post (title, content, hashtage, challenge_success, date, fk_member_id)
        VALUES (?, ?, ?, ?, ?, ?)`;
      values = [title, content, hashtag, false, day, userId];
    } else {
      query = `INSERT INTO tbl_post (title, content, challenge_success, date, fk_member_id)
        VALUES (?, ?, ?, ?, ?)`;
      values = [title, content, false, day, userId];
    }

    await db.execute(query, values);

    return res.status(200).json({ message: "게시물 및 챌린지 생성 완료" });
  } catch (error) {
    console.error("게시물 및 챌린지 생성 중 오류 발생:", error);
    return res.status(500).json({ message: "게시물 및 챌린지 생성 중 오류 발생" });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const db = getConnection();

    const [data] = await db.query(`
      SELECT * FROM tbl_post
    `);

    return res.status(200).json({ message: "모든 게시물 조회 완료", data });
  } catch (error) {
    console.error("게시물 조회 중 오류 발생:", error);
    return res.status(500).json({ message: "게시물 조회 중 오류 발생" });
  }
});

export default router;

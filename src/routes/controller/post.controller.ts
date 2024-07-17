import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../../dataBase";
import { env } from "../../env";

const router = express.Router();

router.post("/post", async (req: Request, res: Response) => {
  const { title, content, hashtag, date } = req.body;
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "토큰이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      env.ACCESS_TOKEN_SECRET
    ) as jwt.JwtPayload;
    const userId = decoded.id;

    const db = getConnection();

    const createPostQuery = `INSERT INTO tbl_post (title, content, fk_member_id)
      VALUES (?, ?, ?)`;
    const createPostValues = [title || null, content || null, userId];

    await db.execute(createPostQuery, createPostValues);

    if (!hashtag) {
      return res.status(200).json({ message: "게시물만 생성 완료" });
    }
    const challengeTitle = hashtag === null ? hashtag : title;

    const createChallengeQuery = `INSERT INTO tbl_challenge (title, content, challenge_success, date, fk_member_id)
      VALUES (?, ?, ?, ?, ?)`;
    const createChallengeValues = [
      challengeTitle ?? null,
      content ?? null,
      false,
      date ?? null,
      userId,
    ];

    await db.execute(createChallengeQuery, createChallengeValues);

    return res.status(200).json({ message: "게시물 및 챌린지 생성 완료" });
  } catch (error) {
    console.error(error, title, content, hashtag, date);
    return res
      .status(500)
      .json({ message: "게시물 및 챌린지 생성 중 오류 발생" });
  }
});


router.get("/post", async (req: Request, res: Response) => {
  const db = getConnection();

  try {
    const query = `SELECT * FROM tbl_post`;
    const [role] = await db.execute(query);

    return res.status(200).json({message:"게시물 불러오기 성공" , role});
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "게시물 조회 중 오류 발생" });
  }
});

export default router;

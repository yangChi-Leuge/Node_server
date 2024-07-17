import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../../dataBase";
import { env } from "../../env";

const router = express.Router();

router.post("/post", async (req: Request, res: Response) => {
  const { title, content, hashtag, date } = req.body;
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "토큰이 필요합니다." });
  }

  try {
    // JWT 토큰 검증 후 사용자 ID 추출
    const decoded = jwt.verify(
      accessToken,
      env.ACCESS_TOKEN_SECRET
    ) as jwt.JwtPayload;
    const userId = decoded.userId;

    const db = getConnection();

    const createPostQuery = `
      INSERT INTO tbl_post (title, content, fk_member_id, hashtag)
      VALUES (?, ?, ?, ?)
    `;
    const createPostValues = [title, content, userId, hashtag || null];

    await db.execute(createPostQuery, createPostValues);

    // 챌린지 제목 설정
    const challengeTitle = hashtag ? hashtag : title;

    const createChallengeQuery = `
      INSERT INTO tbl_challenge (title, content, challenge_success, date, hashtag, fk_member_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const createChallengeValues = [
      challengeTitle,
      content,
      false,
      date,
      hashtag,
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

export default router;

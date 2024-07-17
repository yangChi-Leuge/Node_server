import express, { Request, Response } from "express";
import axios from "axios";
import { getConnection } from "../../dataBase";
import { verifyAccessToken } from "../token/tokeon";
import jwt from "jsonwebtoken";
import {env} from "../../env"

const router = express.Router();
const db = getConnection();

router.post("/post", async (req: Request, res: Response) => {
  const { title, content, hashtage } = req.body;
  const accessToken = req.headers.authorization?.split(" ")[1]; 

  const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);

  
    const createPostQuery = `
      INSERT INTO tbl_post (title, content, fk_member_id, hashtage)
      VALUES (?, ?, ?, ?)
    `;
    const createPostValues = [title, content, userId, hashtage];

    await db.execute(createPostQuery, createPostValues);

    // 해시태그 여부에 따라 챌린지 생성
    const challengeTitle = hashtage ? hashtage : title;

    const createChallengeQuery = `
      INSERT INTO tbl_challenge (title, content, challenge_success, date, hashtage, fk_member_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const createChallengeValues = [
      challengeTitle,
      content,
      false,
      "",
      hashtage,
      userId,
    ];

    await db.execute(createChallengeQuery, createChallengeValues);

    return res.status(200).json({ message: "게시물 및 챌린지 생성 완료" });
  } catch (error) {
    console.error("Error creating post and challenge:", error);
    return res
      .status(500)
      .json({ message: "게시물 및 챌린지 생성 중 오류 발생" });
  }
});

export default router;

import express, { Request, Response } from "express";
import { getConnection } from "../../dataBase";
import { getUserIdFromAccessToken } from "../token/jwt";
import { RowDataPacket } from "mysql2";

const router = express.Router();

router.post("/like", async (req: Request, res: Response) => {
  const { postId, type } = req.query as { postId: string, type: string };
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "토큰이 필요합니다." });
  }

  if (!postId || !type) {
    return res.status(400).json({ message: "postId와 type이 필요합니다." });
  }

  try {
    const userId = getUserIdFromAccessToken(accessToken);
    const db = getConnection();

    let tableName = "";
    let idColumnName = "";

    if (type === "post") {
      tableName = "tbl_post";
      idColumnName = "post_Id";
    } else if (type === "news") {
      tableName = "tbl_news";
      idColumnName = "id";
    } else {
      return res.status(400).json({ message: "잘못된 type입니다." });
    }

    const checkQuery = `SELECT * FROM tbl_like WHERE fk_member_id = ? AND fk_${idColumnName} = ?`;
    const [checkRows] = await db.execute<RowDataPacket[]>(checkQuery, [userId, postId]);

    if (checkRows.length > 0) {
      return res.status(400).json({ message: "이미 좋아요 또는 공감을 하셨습니다." });
    }

    const insertQuery = `INSERT INTO tbl_like (fk_${idColumnName}, fk_member_id) VALUES (?, ?)`;
    await db.execute(insertQuery, [postId, userId]);

    return res.status(200).json({ message: "좋아요 또는 공감 처리 완료" });
  } catch (error) {
    console.error("좋아요 또는 공감 처리 중 오류 발생:", error);
    return res.status(500).json({ message: "요청 처리 중 오류가 발생했습니다." });
  }
});

export default router;

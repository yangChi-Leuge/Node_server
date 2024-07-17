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

router.post("/success", async (req: Request, res: Response) => {
  const { whether,postid } = req.headers;
  const db = getConnection();
  if (!postid) {
    console.log(postid);
    
    return res.status(400).json({ message: "postId가 필요합니다." });
  }

  try {
    if (whether === 'true') {

      const updateQuery = `UPDATE tbl_post SET challenge_success = ? WHERE post_Id = ?`;
      const [data] = await db.execute(updateQuery, [true, postid]);

      // if (result.affectedRows === 0) {
      //   return res.status(404).json({ message: "해당 게시물을 찾을 수 없습니다." });
      // }

      return res.status(200).json({ message: "챌린지 성공 처리 완료" });
    } else {
      return res.status(400).json({ message: "whether 헤더 값이 true가 아닙니다." });
    }
  } catch (error) {
    console.error("챌린지 성공 처리 중 오류 발생:", error);
    return res.status(500).json({ message: "요청 처리 중 오류가 발생했습니다." });
  }
});
export default router;

import express, { Request, Response } from "express";
import { getConnection } from "../../dataBase";
import { RowDataPacket } from "mysql2";

const router = express.Router();

interface GlobalDay {
  id: number;
  date: string;
  name: string;
  description: string;
}

router.get("/", async (req: Request, res: Response) => {
  const { day } = req.query as { day: string };
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "토큰이 없습니다" });
  } else if (!day) {
    return res.status(400).json({ message: "day의 값이 없습니다" });
  }

  try {
    const connection = await getConnection();
    let query = `SELECT * FROM tbl_global_day WHERE date = ?`;
    let params = [day];

    const [results] = await connection.execute<RowDataPacket[]>(query, params);

    if (results.length === 0) {
      query = `SELECT * FROM tbl_global_day WHERE date < ? ORDER BY date DESC LIMIT 1`;
      params = [day];

      const [previousResults] = await connection.execute<RowDataPacket[]>(
        query,
        params
      );

      if (previousResults.length === 0) {
        return res.status(404).json({ message: "No global day found." });
      }

      return res.status(200).json(previousResults[0] as GlobalDay);
    }

    return res.status(200).json(results[0] as GlobalDay);
  } catch (error) {
    console.error("Error fetching global day:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/month", async (req: Request, res: Response) => {
  const { day } = req.query as { day: string };
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "토큰이 필요합니다" });
  } else if (!day) {
    return res.status(400).json({ message: "day에 값이 없습니다" });
  }
  try {
    const connection = await getConnection();
    const month = day.substring(0, 2);
    const query = `SELECT * FROM tbl_global_day WHERE date LIKE ?`;
    const queryParams = [`${month}%`];

    const [rows] = await connection.execute(query, queryParams);

    return res.status(200).json({ message: "success" , rows});
  } catch (error) {
    console.log("challenge/month", error);
  }
});

export default router;

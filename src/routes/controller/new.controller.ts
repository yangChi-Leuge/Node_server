import express, { Request, Response } from "express";
import axios from "axios";
import { getConnection } from "../../dataBase";
import { env } from "../../env";
import { RowDataPacket } from "mysql2";

const router = express.Router();

router.get("/news", async (req: Request, res: Response) => {
  const apiKey = env.NEWS_SECRET_KEY;
  const apiUrl = "https://newsapi.org/v2/top-headlines";
  const language = "en";
  const category = "general";

  const config = {
    params: {
      language: language,
      apiKey: apiKey,
      category: category,
    },
  };

  try {
    const response = await axios.get(apiUrl, config);
    const newsData = response.data.articles;

    const connection = await getConnection();
    for (const news of newsData) {
      let { title, content, author, urlToImage, publishedAt } = news;

      const publishedAtMySQL = new Date(publishedAt).toISOString().slice(0, 19).replace('T', ' ');

      const query = `
        INSERT INTO tbl_news (title, content, author, urlToImage, publishedAt)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        title = VALUES(title), 
        content = VALUES(content),
        author = VALUES(author),
        urlToImage = VALUES(urlToImage),
        publishedAt = VALUES(publishedAt)
      `;

      const params = [title, content, author, urlToImage, publishedAtMySQL];

      await connection.execute(query, params);
    }

    const [data] = await connection.execute<RowDataPacket[]>(
      "SELECT * FROM tbl_news"
    );

    res.status(200).json({ message: "success", data });
  } catch (error) {
    console.error("Error fetching or saving news:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;

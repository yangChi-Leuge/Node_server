import express, { Request, Response } from "express";
import axios from "axios";
import { env } from "../../env";

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
    axios
      .get(apiUrl, config)
      .then((response) => {
        const data = response.data.articles;
        return res.status(200).json({ message: "success", data });
      })
      .catch((error) => {
        console.error("뉴스를 가져오는 중 오류 발생:", error);
        return res
          .status(500)
          .json({ message: "뉴스를 가져오는 중 오류 발생" });
      });
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
});

export default router;

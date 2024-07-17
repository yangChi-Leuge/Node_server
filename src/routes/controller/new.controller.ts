import express, { Request, Response } from 'express';
import axios from 'axios';
import { env } from '../../env';

const router = express.Router();

router.get('/news', async (req: Request, res: Response) => {
  const apiKey = env.NEWS_SECRET_KEY;
  const apiUrl = 'https://newsapi.org/v2/top-headlines';
  const language = 'en';
  const category = 'general';

  const config = {
    params: {
      language: language,
      apiKey: apiKey,
      category: category,
    },
  };

  try {
    const response = await axios.get(apiUrl, config);
    const newsData = response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
    }));

    return res.status(200).json({ message: 'Success', data: newsData });
  } catch (error) {
    console.error('Error fetching world issues news:', error);
    return res.status(500).json({ message: 'Failed to fetch world issues news' });
  }
});

export default router;

import express, { Request, Response } from "express";
import axios from "axios";
import {env} from "../../env"

const router = express.Router();

router.get("/news", async (req: Request, res: Response) => {
    try {
        const worldApi = await axios.get("https://newsapi.org/v2/top-headlines?country=kr&apiKey=70ee44584d0b440c8792518dd25119ef",{
            
        })


        const response = await axios.get("https://openapi.naver.com/v1/search/news.json", {
            params: {
                query: "최신 뉴스",
                display: 10, 
            },
            headers: {
                "X-Naver-Client-Id": env.CLIENT_ID, 
                "X-Naver-Client-Secret": env.CLIENT_SECRET, 
            },
        });
        
        
        const newsData = response.data.items; 
        console.log(newsData);
        return res.status(200).json({message : "success", newsData});
    } catch (error) {
        console.error("Error fetching news:", error);
        return res.status(500).json({ message: "서버 오류" });
    }
});

export default router;

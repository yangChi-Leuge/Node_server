import express, { Request, Response } from "express";
import axios from "axios";
import { env } from "../../env";

const router = express.Router();

router.get("/news", async (req: Request, res: Response) => {
    const apiKey = env.NEWS_SECRET_KEY; 
    const apiUrl = "https://data.un.org/Handlers/ExportHandler.ashx";
  
    const indicatorCode = "CHILD_MORTALITY";
  
    const config = {
      params: {
        dataset: "CHILD_MORTALITY",
        series: "A", 
        api_key: apiKey,
        format: "json",
      },
    };
  
    try {
      const response = await axios.get(apiUrl, config);
      const data = response.data;
  
  
      return res.status(200).json({ message: "success", data });
    } catch (error) {
      console.error("Error fetching children rights data:", error);
      return res.status(500).json({ message: "Failed to fetch children rights data" });
    }
  });


export default router;

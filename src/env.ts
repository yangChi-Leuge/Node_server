import dotenv from "dotenv";

dotenv.config();

export const env = {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_DATABASE: process.env.DB_DATABASE || "testdb",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
  CLIENT_ID: process.env.CLIENT_ID || "",
  CLIENT_SECRET:process.env.CLIENT_SECRET || "",
  NEWS_SECRET_KEY: process.env.SECRET_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
};

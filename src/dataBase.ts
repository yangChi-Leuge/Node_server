import { createConnection, Connection } from "mysql2/promise";
import { env } from "./env";

let connection: Connection | null = null;

// 데이터베이스 연결을 설정하는 함수
export const connectDatabase = async (): Promise<Connection> => {
  try {
    const conn = await createConnection({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    });
    console.log("Database connected");
    connection = conn;
    return conn;
  } catch (error) {
    console.error("Error connecting to MySQL database:", error);
    throw error;
  }
};

export const getConnection = (): Connection => {
  if (!connection) {
    throw new Error('Database connection not established');
  }
  return connection;
};

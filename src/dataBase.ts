import { createConnection, Connection } from "mysql2/promise";
import { env } from "./env";

let connection: Connection | null = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await createConnection({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    });
    console.log("Database connected");
    connection = conn;
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
